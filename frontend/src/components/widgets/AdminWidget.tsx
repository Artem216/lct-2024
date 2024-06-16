import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import UserTable from "../shared/UserTable"
import CurvedlineChart from "../shared/LineChart"
import { useAdmin } from "@/context/AdminContext"
import LineGenChart from "../shared/LineGenChart"

export default function AdminWidget() {
  const { userStatistics } = useAdmin()
  const [activeView, setActiveView] = useState('users')

  const handleViewChange = (view: any) => {
    setActiveView(view)
  }

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link to="#" className="flex items-center gap-2 font-semibold">
              <Package2Icon className="h-6 w-6" />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <button
                onClick={() => handleViewChange('users')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeView === 'users' ? 'text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-gray-50' : 'text-gray-500 dark:text-gray-400'} hover:text-gray-900 dark:hover:text-gray-50`}
              >
                <UsersIcon className="h-4 w-4" />
                Пользователи
              </button>
              <button
                onClick={() => handleViewChange('statistics')}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${activeView === 'statistics' ? 'text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-gray-50' : 'text-gray-500 dark:text-gray-400'} hover:text-gray-900 dark:hover:text-gray-50`}
              >
                <LineChartIcon className="h-4 w-4" />
                Статистика по генерациям
              </button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {activeView === 'users' ? (
            <div>
              <div className="border shadow-sm rounded-lg p-2 text-black">
                <UserTable />
              </div>
              <div className="flex justify-around mt-4">
                <div className="w-[700px] h-full">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-[20px] text-primary-500">Зарегестрированные пользователи</CardTitle>
                      <LineChartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <CurvedlineChart className="w-full aspect-[4/3] text-black" />
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col justify-around items-center h-[70%] my-auto">
                  <Card className="w-[300px]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-primary-500">Новые пользователи</CardTitle>
                      <UserPlusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-[50px] font-bold text-primary-500">{userStatistics.y[userStatistics.y.length - 1]}</div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        +{userStatistics.y[userStatistics.y.length - 1] - userStatistics.y[userStatistics.y.length - 2]} с прошлого месяца
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="w-[300px]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-primary-500">Всего пользователей</CardTitle>
                      <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-[50px] font-bold text-primary-500">
                        {userStatistics.y.reduce((partialSum, a) => partialSum + a, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Card className="h-[50%] mt-10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-[20px] text-primary-500">Статистика по генерациям</CardTitle>
                  <LineChartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </CardHeader>
                <CardContent className="h-full">
                  <LineGenChart className="w-full aspect-[4/3] text-black h-full" />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


function LineChartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}



function Package2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function UserPlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}


function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}