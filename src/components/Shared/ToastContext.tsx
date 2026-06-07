import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (
        message: string,
        type: ToastType = "success"
    ) => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    return (

        // <AnimatePresence>
        //     {toast && (
        //         <motion.div
        //             initial={{ opacity: 0, y: 50, x: "-50%" }}
        //             animate={{ opacity: 1, y: 0, x: "-50%" }}
        //             exit={{ opacity: 0, y: 50, x: "-50%" }}
        //             className="fixed bottom-24 left-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50 font-black flex items-center gap-3 whitespace-nowrap">
        //             <Check className="w-5 h-5" />
        //             <span>ثبت‌نام شما با موفقیت انجام شد</span>
        //         </motion.div>
        //     )}
        // </AnimatePresence>

        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (

                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 50, x: "-50%" }}
                            className="fixed bottom-24 left-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50 font-black flex items-center gap-3 whitespace-nowrap">
                            <Check className="w-5 h-5" />
                            <span>ثبت‌نام شما با موفقیت انجام شد</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                // <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                //   <div
                //     className={`px-6 py-3 rounded-xl text-white shadow-lg
                //     ${
                //       toast.type === "success"
                //         ? "bg-emerald-600"
                //         : "bg-red-600"
                //     }`}
                //   >
                //     {toast.message}
                //   </div>
                // </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
};