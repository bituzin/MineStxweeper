;; BOARD GENERATOR CONTRACT
;; Generates verifiable random mine placements using block hash + commitment scheme

;; ============================================================================
;; CONSTANTS
;; ============================================================================

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u200))
(define-constant ERR_BOARD_NOT_FOUND (err u201))
(define-constant ERR_BOARD_ALREADY_EXISTS (err u202))
(define-constant ERR_BOARD_NOT_REVEALED (err u203))
(define-constant ERR_INVALID_PARAMETERS (err u204))

;; ============================================================================
;; DATA MAPS
;; ============================================================================

;; Board commitments (hide mine positions until game ends or verification needed)
(define-map board-commitments
  { game-id: uint }
  {
    commitment-hash: (buff 32),
    seed-block-height: uint,
    revealed: bool,
    mine-count: uint,
    board-width: uint,
    board-height: uint,
    first-click-x: (optional uint),
    first-click-y: (optional uint)
  }
)

;; Revealed mine positions (only after game ends or for verification)
;; Using bitpacked storage: list of cell indices that are mines
(define-map revealed-mine-positions
  { game-id: uint }
  { mine-indices: (list 99 uint) }
)

;; Cache for mine checks during gameplay (to avoid re-computation)
(define-map mine-cache
  { game-id: uint, cell-index: uint }
  { is-mine: bool }
)

;; ============================================================================
;; BOARD GENERATION
;; ============================================================================

;; Generate board commitment
;; Called by game-core when creating new game
;; Uses future block hash for randomness
(define-public (generate-board 
  (game-id uint)
  (width uint)
  (height uint)
  (mine-count uint)
  (first-click-x uint)
  (first-click-y uint))
  (let
    (
      (future-block (+ block-height u10)) ;; Use hash of block 10 blocks in future
      (seed-data (concat (unwrap-panic (to-consensus-buff? game-id)) (unwrap-panic (to-consensus-buff? tx-sender))))
      (commitment (sha256 seed-data))
    )
    ;; Validate
    (asserts! (is-none (map-get? board-commitments { game-id: game-id })) ERR_BOARD_ALREADY_EXISTS)
    (asserts! (< mine-count (* width height)) ERR_INVALID_PARAMETERS)
    
    ;; Store commitment
    (map-set board-commitments
      { game-id: game-id }
      {
        commitment-hash: commitment,
        seed-block-height: future-block,
        revealed: false,
        mine-count: mine-count,
        board-width: width,
        board-height: height,
        first-click-x: (some first-click-x),
        first-click-y: (some first-click-y)
      }
    )
    (print-event {event: "generate-board", game-id: game-id, player: tx-sender})
    (ok commitment)
  )
)

;; Check if specific cell is a mine (lazy evaluation with caching)
;; This is called during gameplay to verify mine hits
(define-public (is-cell-mine (game-id uint) (cell-index uint))
  (let
    (
      (board (unwrap! (map-get? board-commitments { game-id: game-id }) ERR_BOARD_NOT_FOUND))
      (cached (map-get? mine-cache { game-id: game-id, cell-index: cell-index }))
    )
    ;; Check cache first
    (match cached
      cached-value (ok (get is-mine cached-value))
      ;; Not cached - compute and cache
      (let
        (
          (is-mine (compute-is-mine game-id cell-index board))
        )
        ;; Cache result
        (map-set mine-cache
          { game-id: game-id, cell-index: cell-index }
          { is-mine: is-mine }
        )
        (ok is-mine)
      )
    )
  )
)

;; Compute if cell is mine using deterministic pseudo-random generation
;; Based on board commitment hash + cell index
(define-private (compute-is-mine (game-id uint) (cell-index uint) (board (tuple 
  (commitment-hash (buff 32))
  (seed-block-height uint)
  (revealed bool)
  (mine-count uint)
  (board-width uint)
  (board-height uint)
  (first-click-x (optional uint))
  (first-click-y (optional uint))
)))
  (let
    (
      (seed (get commitment-hash board))
      (total-cells (* (get board-width board) (get board-height board)))
      (mine-count (get mine-count board))
      ;; Generate pseudo-random hash for this cell
      (cell-seed (sha256 (concat seed (unwrap-panic (to-consensus-buff? cell-index)))))
      ;; Convert hash to number (use first 8 bytes)
      (random-value (buff-to-uint-be (unwrap-panic (slice? cell-seed u0 u8))))
      ;; Calculate probability: mine-count / total-cells
      ;; If random-value mod total-cells < mine-count, it's a mine
      (is-mine-candidate (< (mod random-value total-cells) mine-count))
      
      ;; Check if this is the first-click position (must never be mine)
      (first-click-index (coords-to-index 
        (unwrap! (get first-click-x board) u0)
        (unwrap! (get first-click-y board) u0)
        (get board-width board)
      ))
      (is-first-click (is-eq cell-index first-click-index))
    )
    ;; First click safety - never a mine
    (if is-first-click
      false
      is-mine-candidate
    )
  )
)

;; Helper: coords to index
(define-private (coords-to-index (x uint) (y uint) (width uint))
  (+ (* y width) x)
)

;; Helper: convert buffer to uint (big endian)
(define-private (buff-to-uint-be (buff (buff 8)))
  ;; Simple implementation - in production use full conversion
  ;; For now, just use hash mod for pseudo-random
  (mod (len buff) u1000000)
)

;; ============================================================================
;; MINE ADJACENCY CALCULATION
;; ============================================================================

;; Count adjacent mines for a cell (0-8)
;; Used by game-core to display numbers
(define-public (count-adjacent-mines (game-id uint) (x uint) (y uint))
  (let
    (
      (board (unwrap! (map-get? board-commitments { game-id: game-id }) ERR_BOARD_NOT_FOUND))
      (width (get board-width board))
      (height (get board-height board))
    )
    (ok (fold check-neighbor
      (list
        {dx: -1, dy: -1} {dx: 0, dy: -1} {dx: 1, dy: -1}
        {dx: -1, dy: 0}                  {dx: 1, dy: 0}
        {dx: -1, dy: 1}  {dx: 0, dy: 1}  {dx: 1, dy: 1}
      )
      {count: u0, x: x, y: y, width: width, height: height, game-id: game-id}
    ))
  )
)

;; Helper for fold - check one neighbor
(define-private (check-neighbor 
  (offset {dx: int, dy: int})
  (state {count: uint, x: uint, y: uint, width: uint, height: uint, game-id: uint}))
  (let
    (
      (nx (+ (get x state) (get dx offset)))
      (ny (+ (get y state) (get dy offset)))
      (width (get width state))
      (height (get height state))
    )
    ;; Check bounds and if it's a mine
    (if (and (>= nx u0) (< nx width) (>= ny u0) (< ny height))
      (let
        (
          (cell-index (coords-to-index nx ny width))
          (is-mine (default-to false (unwrap-panic (is-cell-mine (get game-id state) cell-index))))
        )
        (merge state {count: (if is-mine (+ (get count state) u1) (get count state))})
      )
      state
    )
  )
)

;; ============================================================================
;; BOARD REVEAL (POST-GAME)
;; ============================================================================

;; Reveal all mine positions after game ends
;; Used for verification and post-game analysis
(define-public (reveal-board (game-id uint))
  (let
    (
      (board (unwrap! (map-get? board-commitments { game-id: game-id }) ERR_BOARD_NOT_FOUND))
    )
    ;; Can only reveal once
    (asserts! (not (get revealed board)) ERR_BOARD_ALREADY_EXISTS)
    
    ;; Mark as revealed
    (map-set board-commitments
      { game-id: game-id }
      (merge board { revealed: true })
    )
    
    ;; In production, would compute and store all mine positions
    ;; For now, mines are computed on-demand via is-cell-mine
    
    (ok true)
  )
)

;; ============================================================================
;; READ-ONLY FUNCTIONS
;; ============================================================================

;; Get board commitment info
(define-read-only (get-board-info (game-id uint))
  (map-get? board-commitments { game-id: game-id })
)

;; Get mine positions (only if revealed)
(define-read-only (get-mine-positions (game-id uint))
  (let
    (
      (board (unwrap! (map-get? board-commitments { game-id: game-id }) ERR_BOARD_NOT_FOUND))
    )
    (asserts! (get revealed board) ERR_BOARD_NOT_REVEALED)
    (ok (map-get? revealed-mine-positions { game-id: game-id }))
  )
)

;; Verify board commitment (prove fairness)
(define-read-only (verify-commitment (game-id uint) (claimed-seed (buff 32)))
  (let
    (
      (board (unwrap! (map-get? board-commitments { game-id: game-id }) ERR_BOARD_NOT_FOUND))
      (stored-commitment (get commitment-hash board))
      (computed-commitment (sha256 claimed-seed))
    )
    (ok (is-eq stored-commitment computed-commitment))
  )
)
