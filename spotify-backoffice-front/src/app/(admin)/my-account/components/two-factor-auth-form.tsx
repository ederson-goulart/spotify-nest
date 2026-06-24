"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { activate2fa, disable2fa, get2faSecret } from "./actions";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface TwoFactorAuthFormProps {
  twoFactorActivated: boolean;
}

export default function TwoFactorAuthForm({
  twoFactorActivated,
}: TwoFactorAuthFormProps) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleEnableClick = async () => {
    const response = await get2faSecret();
    if (response.success) {
      toast.success(response.message, {
        style: { background: "green", color: "white" },
      });

      setCode(response.data as string);
      setStep(2);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await activate2fa(otp);

    if (!response?.success) {
      toast.error(response?.message, {
        style: { background: "red", color: "white" },
      });
    }

    if (response?.success) {
      toast.success(response?.message, {
        style: { background: "green", color: "white" },
      });

      setIsActivated(true);
    }
  };

  const handleDisable2faClick = async () => {
    const response = await disable2fa();

    if (!response?.success) {
      toast.error(response?.message, {
        style: { background: "red", color: "white" },
      });
    }

    if (response?.success) {
      toast.success(response?.message, {
        style: { background: "green", color: "white" },
      });

      setIsActivated(false);
    }
  };

  return (
    <div>
      {isActivated && (
        <div>
          <Button onClick={handleDisable2faClick} variant={"destructive"}>
            Desabilitar autenticação de dois fatores
          </Button>
        </div>
      )}

      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnableClick}>
              Habilitar autenticação de dois fatores
            </Button>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground py-2">
                Leia este QR code no seu App de Autenticação preferido, por
                exemplo no Google Authenticator ou Microsoft Authenticator.
              </p>
              <QRCodeSVG value={code} />
              <Button onClick={() => setStep(3)}>QR code escaneado</Button>
              <Button onClick={() => setStep(1)} variant="outline">
                Cancelar
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Informe o código de verificação do seu App de Autenticação (ex.:
                Google Authenticator, Microsoft Authenticator)
              </p>
              <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button disabled={otp.length !== 6}>Ativar 2FA</Button>
                <Button variant={"outline"} onClick={() => setStep(2)}>
                  Cancelar
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
