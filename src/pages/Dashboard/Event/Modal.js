import React, { useEffect } from 'react'

export default function Modal({
  children,
  className,
  open,
  close,
  useCard,
  ...props
}) {
  useEffect(() => {
    const keydown = (e) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', keydown)

    return () => window.removeEventListener('keydown', keydown)
  }, [open])

  return (
    <div className={`modal ${open && 'is-active'} ${className}`} {...props}>
      <div className="modal-background" onClick={close}></div>
      {useCard ? (
        <div className="modal-card">{children}</div>
      ) : (
        <div className="modal-content">{children}</div>
      )}
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
    </div>
  )
}
