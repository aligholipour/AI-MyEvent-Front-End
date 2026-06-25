import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

function ParticipantsDrawer({
  isOpen,
  onClose,
  participants
}: {
  isOpen: boolean;
  onClose: () => void;
  participants: any[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[120] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[80vh] bg-white z-[130] rounded-t-2xl shadow-2xl flex flex-col pt-2"
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4 flex-shrink-0" />

            <div className="px-6 pb-4 flex items-center justify-between flex-shrink-0">
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-gray-900">لیست شرکت کنندگان</h2>
                <p className="text-[10px] font-bold text-gray-400 mt-1">{participants.length} نفر ثبت نام کرده‌اند</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-12 no-scrollbar">
              <div className="space-y-4 mt-4">
                {participants.map((person) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={person.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
                  >
                    <div className="flex items-center gap-4">
                      <img src={process.env.File_BaseURL + person.profileAddress} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800">{person.fullname}</span>
                        {/* <span className="text-[10px] font-bold text-gray-400">{person.role}</span> */}
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
                      مشاهده پروفایل
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ParticipantsDrawer;