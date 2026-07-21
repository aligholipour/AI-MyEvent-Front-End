// AuthDrawer.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import StepOTP from "./StepOTP";
import Login from "./Login";

function AuthDrawer({ isOpen, onClose, onLoginSuccess, onRegisterNeeded }: {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
    onRegisterNeeded: (phone: string) => void;
}) {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isExistUser, setIsExistUser] = useState(false);
    const [token, setToken] = useState<string | undefined>('');

    // Reset step when opening
    useEffect(() => {
        if (isOpen) {
            setStep('phone');
            setPhoneNumber('');
            setIsExistUser(false);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with premium blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-[4px]"
                    />

                    {/* Bottom Sheet - Mobile premium keyboard-responsive container */}
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 240 }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-[#F8F9FC] z-[160] rounded-t-[30px] shadow-[0_-10px_35px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
                        dir="rtl"
                        style={{ maxHeight: '92vh' }}
                    >
                        {/* Elegant drag/visual handle bar */}
                        <div className="w-10 h-1.5 bg-gray-300/60 rounded-full mx-auto mt-3.5 mb-2 shrink-0" />

                        {/* Inner responsive area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-3 pb-7 flex flex-col justify-start">
                            <AnimatePresence mode="wait">
                                {step === 'phone' ? (
                                    <Login
                                        key="phone-step"
                                        onClose={onClose}
                                        onContinue={(num, isNew, token) => {
                                            setPhoneNumber(num);
                                            setIsExistUser(isNew);
                                            setToken(token);
                                            setStep('otp');
                                        }}
                                    />
                                ) : (
                                    <StepOTP
                                        key="otp-step"
                                        phoneNumber={phoneNumber}
                                        token={token}
                                        onBack={() => setStep('phone')}
                                        onSuccess={(loggedInUser) => {
                                            if (!isExistUser) {
                                                onRegisterNeeded(phoneNumber);
                                            } else if (loggedInUser) {
                                                onLoginSuccess();
                                            }
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default AuthDrawer;