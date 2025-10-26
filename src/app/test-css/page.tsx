export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ทดสอบ Tailwind CSS
        </h1>
        <p className="text-gray-700 mb-4">
          หากคุณเห็นข้อความนี้พร้อมกับสีและรูปแบบที่สวยงาม แสดงว่า Tailwind CSS ทำงานถูกต้อง
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ปุ่มทดสอบ
        </button>
      </div>
    </div>
  );
}
