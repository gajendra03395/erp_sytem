export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Analytics Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Monitor your business performance and key metrics</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$2,847,500</p>
          <p className="text-sm text-green-500 dark:text-green-400">+12.5% vs last period</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Users</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
          <p className="text-sm text-green-500 dark:text-green-400">91% of total users</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
          <p className="text-sm text-green-500 dark:text-green-400">384 this month</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">System Uptime</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">99.8%</p>
          <p className="text-sm text-green-500 dark:text-green-400">Excellent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Customer Satisfaction</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">92.1%</span>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">Excellent</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{width: '92.1%'}}></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Employee Productivity</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">78.9%</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">Good</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{width: '78.9%'}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}