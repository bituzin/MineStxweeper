;; GM Contract - Simple greeting for Stacks community

(define-public (gm)
  (print {event: "gm", greeter: tx-sender})
  (ok "Good morning, Stacks!")
)

;; Optional: store last greeter
(define-data-var last-greeter principal tx-sender)

(define-public (gm-save)
  (begin
    (var-set last-greeter tx-sender)
    (print {event: "gm-save", greeter: tx-sender})
    (ok "GM saved!")
  )
)

(define-read-only (get-last-greeter)
  (ok (var-get last-greeter))
)
