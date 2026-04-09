function Icon({ name, className = '', filled = false }) {
  return (
    <span className={`material-symbols-outlined ${filled ? 'material-filled' : ''} ${className}`}>
      {name}
    </span>
  )
}

export default Icon


