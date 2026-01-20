import DormList from "../components/dorms/dorm-list";
import { DormListProps } from "../lib/types";

const mockupDorms: DormListProps[] = [
  {
    id: "1",
    name: "หอพักสุขสบาย",
    address: {
      number: "123/45",
      street: "ถนนพระรามที่ 1",
      district: "แขวงปทุมวัน",
      city: "เขตปทุมวัน",
      province: "กรุงเทพมหานคร",
      postalCode: "10330",
    },
    detail: "ใกล้มหาวิทยาลัย เดินทางสะดวก อาคาร 5 ชั้น มีลิฟต์และที่จอดรถ",
    createdAt: new Date("2025-01-01"),
    landlord: {
      name: "นายสมชาย ใจดี",
    },
    role: "member",
    phoneNumber: "081-234-5678",
    idLine: "@suksanbai",
  },
  {
    id: "2",
    name: "หอพักร่มเย็น",
    address: {
      number: "88/9",
      street: "ถนนพหลโยธิน",
      district: "แขวงจตุจักร",
      city: "เขตจตุจักร",
      province: "กรุงเทพมหานคร",
      postalCode: "10900",
    },
    detail:
      "บรรยากาศเงียบสงบ เหมาะสำหรับนักศึกษา มี Wi-Fi และระบบรักษาความปลอดภัย",
    createdAt: new Date("2025-01-15"),
    landlord: {
      name: "นางสาวอรทัย รักดี",
    },
    role: "member",
    phoneNumber: "081-234-5678",
    idLine: "@suksanbai",
  },
];

function DormsHomePage() {
  return <DormList dorms={mockupDorms}></DormList>;
}

export default DormsHomePage;
