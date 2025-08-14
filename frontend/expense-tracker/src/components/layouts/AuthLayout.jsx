const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    {/* Remove max-w-md here to allow children to decide width */}
    <div className="w-full max-w-4xl px-4">
      {children}
    </div>
  </div>
);

export default AuthLayout;
