import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              📚 readBOOK
            </Link>
            <nav className="flex space-x-8">
              <Link href="/books" className="text-blue-600 font-medium">
                หนังสือทั้งหมด
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900">
                ค้นหา
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                หมวดหมู่
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่ readBOOK
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ห้องสมุดดิจิทัลสำหรับอ่านหนังสือออนไลน์
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/books"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ดูหนังสือทั้งหมด
            </Link>
            <Link
              href="/search"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ค้นหาหนังสือ
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">หนังสือหลากหลาย</h3>
            <p className="text-gray-600">
              หนังสือในหมวดหมู่ต่างๆ มากมาย
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">ค้นหาง่าย</h3>
            <p className="text-gray-600">
              ค้นหาหนังสือได้อย่างรวดเร็ว
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">อ่านได้ทุกที่</h3>
            <p className="text-gray-600">
              อ่านหนังสือได้ทุกอุปกรณ์
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
