import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const businessFields = [
    'BTL Promotion',
    '컨설팅체어스',
    '멀업스토어', 
    '스타일링클래스',
    '에이전시',
    '진시',
    '투터클래스',
    '패션쇼',
    'CSR'
  ]

  const navItems = [
    { href: '/', label: 'MAIN' },
    { href: '/about', label: 'ABOUT' },
    { href: '/history', label: 'HISTORY' },
    { href: '/works', label: 'WORKS' },
    { href: '/contact', label: 'CONTACT' },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="w-full px-16 sm:px-20 lg:px-32 xl:px-40">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 tracking-wider">
                HOWDOYOUDO
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-medium">Company Name</span><br />
                  (주)하우두유두
                </p>
                <p>
                  <span className="font-medium">CEO</span><br />
                  김덕일
                </p>
                <p>
                  <span className="font-medium">Incorporation</span><br />
                  2005년 02월
                </p>
              </div>
            </div>

            {/* Business Fields */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 tracking-wide">
                FIELD OF BUSINESS
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {businessFields.map((field, index) => (
                  <span 
                    key={index}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 tracking-wide">
                QUICK LINKS
              </h4>
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-8">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-500">
                © {currentYear} <span className="text-red-500 font-medium">howdoyoudo</span>. All Rights Reserved.
              </p>
              
              {/* Additional Links */}
              <div className="flex space-x-6">
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}