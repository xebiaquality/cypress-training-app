import './App.css'
import { Menu } from './components/menu'
import { Sidebar } from './components/sidebar'
import { Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './query-client'

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="hidden md:block">
          <Menu />
          <div className="border-t">
            <div className="bg-background">
              <div className="grid lg:grid-cols-5">
                <Sidebar className="hidden lg:block" />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  <div className="h-full px-4 py-6 lg:px-8">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
