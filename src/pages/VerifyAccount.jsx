import React from 'react'

const VerifyAccount = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/60 to-purple-900/60 z-0"></div>
    </div>
  )
}

export default VerifyAccount