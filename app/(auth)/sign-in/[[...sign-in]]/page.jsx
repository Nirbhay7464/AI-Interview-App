import { SignIn } from '@clerk/nextjs'

export default function Page() {

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Side (Image Section) */}
        <aside className="relative block h-32 lg:order-last lg:col-span-5 lg:h-screen">
          <img
            alt="Welcome"
            src="5825575_56563.jpg"
            className="absolute inset-0 h-screen w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold">Welcome to AI Interview App</h2>
              <p className="mt-2 text-sm text-gray-200">
                Prepare for your dream role with interactive AI.
                Get instant insights,refine your communication skills,and walk into every interview with confidence.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side (Form Section) */}
        <main
          aria-label="Main"
          className="flex items-center justify-center px-8 py-12 lg:col-span-7"
        >
         
            
            <SignIn/>
            
          
        </main>
      </div>
    </section>
  );
  
}