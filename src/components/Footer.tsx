export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-gray-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-gray-600 sm:px-6 md:flex-row md:text-left lg:px-8">
        <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        <p>সকল দাম সম্ভাব্য; বাজারের অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
