import { ArrowPathIcon } from "@heroicons/react/24/solid";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

interface CustomCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

const CustomCaptcha = forwardRef<{ refresh: () => void }, CustomCaptchaProps>(
  ({ onValidate }, ref) => {
    const [captchaText, setCaptchaText] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);

    const generateCaptcha = (): void => {
      const characters: string =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz@!#$%^&*0123456789";
      let result: string = "";
      // eslint-disable-next-line no-plusplus
      for (let i: number = 0; i < 6; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
      setCaptchaText(result);
      setUserInput("");
      setIsValid(false);
      onValidate(false);
    };

    useEffect(() => {
      generateCaptcha();
    }, []);

    useImperativeHandle(ref, () => ({
      refresh: generateCaptcha,
    }));

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const input: string = e.target.value;
      setUserInput(input);
      const valid: boolean = input === captchaText;
      setIsValid(valid);
      onValidate(valid);
    };

    return (
      <div className="max-w-md">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="relative flex-shrink-0 p-1 font-mono text-xl bg-white border-2 border-[#c2e2ff] rounded-md shadow-inner select-none bg-gradient-to-r from-purple-50 to-blue-50"
            style={{ width: "150px" }}
          >
            <span className="pr-6 text-sm sm:text-lg">{captchaText}</span>
            <button
              type="button"
              onClick={generateCaptcha}
              className="absolute flex items-center justify-center p-1 text-white transform -translate-y-1/2 rounded-md shadow-md right-1 top-1/2 bg-gradient-to-r from-[#0a499e] to-[#208ef0]"
            >
              <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="relative">
            <input
              id="captchaInput"
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter captcha"
              className="p-2 pr-8 text-sm transition-all duration-200 border border-[#c2e2ff] rounded-md w-36 sm:w-40 focus:ring-2 focus:ring-[#c2e2ff] sm:text-base"
            />
            {userInput && (
              <p
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-lg ${
                  isValid ? "text-green-500" : "text-red-500"
                }`}
              >
                {isValid ? "✓" : "✗"}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default CustomCaptcha;
