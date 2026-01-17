import supabase from '@/configs/supabase';
import { NextRequest, NextResponse } from 'next/server';
import transporter from '@/configs/mail_sender';

const generate_OTP6_Numeric = () => {
    const digits = Math.floor(Math.random() * 1000000);    
    return digits.toString().padStart(6, '0');
}

const send_otp_email = async (email: string, otp_code: string) => {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL_NAME || 'no-reply-me@ku.th',
        to: email,
        subject: 'รหัส OTP สำหรับยืนยันอีเมลเพื่อใช้ในการสมัคร Matemap',
        text: `รหัส OTP ของคุณคือ : ${otp_code}`, 
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Verification Code</h2>
                <p>รหัส OTP ของคุณคือ:</p>
                <h1 style="color: #006b5e; letter-spacing: 5px;">${otp_code}</h1>
                <p>รหัสนี้จะหมดอายุภายใน 5 นาที </p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if ((!email || !String(email).endsWith('@ku.th')) && process.env.NODE_ENV !== 'development' ) {
            return NextResponse.json({ message: "กรุณาใช้อีเมล @ku.th เท่านั้น" }, { status: 400 });
        }

        const otp_code = generate_OTP6_Numeric();

        // 3. บันทึกลง Supabaseยุ
        const { error } = await supabase
            .from('otp')
            .insert({ 
                email: email, 
                otp_code: otp_code,
            });

        if (error) {
            console.error("Supabase Error:", error.message);
            throw new Error("ไม่สามารถบันทึกข้อมูล OTP ได้");
        }

        // 4. ส่ง Email
        await send_otp_email(email, otp_code);

        return NextResponse.json({ message: 'ส่ง OTP ไปที่อีเมลแล้ว' }, { status: 200 });

    } catch (err) {
        console.error("API Error:", (err as Error).message);
        return NextResponse.json({ message: (err as Error).message }, { status: 500 });
    }
}