import DormEdit from "@/app/dashboard/components/dorms/dorm-edit";

const mockupDorm = {
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
  phoneNumber: "081-234-5678",
  idLine: "@suksanbai",
};

async function DormEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number(await params);

  return <DormEdit dorm={mockupDorm}></DormEdit>;
}

export default DormEditPage;
