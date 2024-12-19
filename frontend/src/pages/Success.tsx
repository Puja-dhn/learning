import React from "react";

import { useNavigate } from "react-router-dom";

import { EnvelopeIcon } from "@heroicons/react/24/solid";
import Successlogo from "@/assets/images/success_logo.png";

import Button from "@/features/ui/buttons/Button";

function Success() {
  const navigate = useNavigate();

  const handleBacktoLogin = () => {
    navigate("/auth/domain-login", { replace: true });
  };

  return (
    <div className="flex items-center justify-center w-full h-full overflow-auto">
      <div className="flex flex-col items-center justify-center gap-4">
        <img src={Successlogo} alt="" className="h-12 md:h-24 lg:h-24 " />
        <h2 className="text-lg font-bold text-sky-800 dark:text-cyan-600">
          Thank You!
        </h2>
        <div className="flex flex-col items-center justify-center gap-1 p-4">
          <div className="text-center text-sky-800">
            You registration has been successfull. Account will be activated
            soon.
          </div>
          <div className="text-center  text-sky-800">
            <span>
              Incase of any issue Please contact
              <span className="font-bold text-sky-800 ">
                <a href="mail:safetysystemsupport@tatamotors.onmicrosoft.com">
                  <EnvelopeIcon className="inline-block w-5 h-5 mx-1" />
                  Administrator.
                </a>
              </span>
            </span>
          </div>
        </div>
        <Button onClick={handleBacktoLogin} className="ml-4" btnType="reset">
          Back to Login
        </Button>
      </div>
    </div>
  );
}

export default Success;
