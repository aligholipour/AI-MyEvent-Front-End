// ParticipantsDrawer.tsx
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft } from "lucide-react";
import * as LucideIcons from 'lucide-react';

// function ParticipantsDrawer({
//     isOpen,
//     onClose,
//     participants
// }: {
//     isOpen: boolean;
//     onClose: () => void;
//     participants: any[];
// }) {
//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     {/* Backdrop with premium blur */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={onClose}
//                         className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
//                     />
                    
//                     {/* Bottom Sheet - Premium design */}
//                     <motion.div
//                         initial={{ y: "100%", x: "-50%" }}
//                         animate={{ y: 0, x: "-50%" }}
//                         exit={{ y: "100%", x: "-50%" }}
//                         transition={{ type: "spring", damping: 28, stiffness: 220 }}
//                         className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[75vh] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
//                         dir="rtl"
//                     >
//                         {/* Elegant handle bar */}
//                         <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3 shrink-0" />

//                         {/* Header - Redesigned */}
//                         <div className="px-6 pb-4 flex items-center justify-between shrink-0">
//                             <div className="flex flex-col text-right">
//                                 <h2 className="text-lg font-black text-gray-900">لیست شرکت‌کنندگان</h2>
//                                 <p className="text-[10px] font-bold text-gray-400 mt-0.5">
//                                     {participants.length} نفر ثبت‌نام شده فعال
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={onClose}
//                                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
//                             >
//                                 <X className="w-4 h-4" />
//                             </button>
//                         </div>

//                         {/* Participants List - Redesigned */}
//                         <div className="flex-1 overflow-y-auto px-6 pb-10 no-scrollbar">
//                             <div className="space-y-3.5 mt-2">
//                                 {participants.map((person, index) => (
//                                     <motion.div
//                                         initial={{ opacity: 0, y: 10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{ delay: index * 0.05 }}
//                                         key={person.id}
//                                         className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100/30 hover:bg-white hover:border-gray-100 transition-all duration-200"
//                                     >
//                                         <div className="flex items-center gap-3 text-right">
//                                             <img
//                                                 src={process.env.File_BaseURL + person.profileAddress}
//                                                 alt={person.fullname}
//                                                 className="w-10 h-10 rounded-full border-2 border-white shadow-xs object-cover"
//                                             />
//                                             <div className="flex flex-col">
//                                                 <span className="text-xs font-black text-gray-800">{person.fullname}</span>
//                                                 {person.role && (
//                                                     <span className="text-[9px] font-bold text-gray-400">{person.role}</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                         <button className="text-[9px] font-black text-[#007AFF] bg-blue-50/75 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
//                                             مشاهده پروفایل
//                                         </button>
//                                     </motion.div>
//                                 ))}

//                                 {participants.length === 0 && (
//                                     <div className="flex flex-col items-center justify-center py-12 text-center">
//                                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
//                                             <X className="w-8 h-8" />
//                                         </div>
//                                         <p className="text-sm font-black text-gray-400">هنوز کسی ثبت‌نام نکرده است</p>
//                                         <p className="text-[10px] font-bold text-gray-300 mt-1">اولین نفر باشید!</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }

// export default ParticipantsDrawer;


function ParticipantsDrawer({
  isOpen,
  onClose,
  participants,
}: {
  isOpen: boolean;
  onClose: () => void;
  participants: any[];
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ y: '100%', x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: '100%', x: '-50%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-1/2 w-full max-w-[480px] h-[75vh] bg-white z-[160] rounded-t-[30px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col pt-2"
        dir="rtl"
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-3 shrink-0" />

        <div className="px-6 pb-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col text-right">
            <h2 className="text-lg font-black text-gray-900">لیست شرکت‌کنندگان</h2>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">
              {participants.length} نفر ثبت‌نام شده فعال
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/50"
          >
            <LucideIcons.X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 no-scrollbar">
          <div className="space-y-3.5 mt-2">
            {participants.map((person) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={person.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100/30"
              >
                <div className="flex items-center gap-3 text-right">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-xs object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">{person.name}</span>
                    <span className="text-[9px] font-bold text-gray-400">{person.role}</span>
                  </div>
                </div>
                <button className="text-[9px] font-black text-[#007AFF] bg-blue-50/75 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
                  مشاهده پروفایل
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ParticipantsDrawer;