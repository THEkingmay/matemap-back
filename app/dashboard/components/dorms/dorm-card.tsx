"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { DormCardProps } from "../../lib/types";
import { formatDate } from "../../lib/util";

function DormCard({ dorm }: DormCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Link className="hover: underline" href={`/dashboard/dorms/${dorm.id}`}>
          <CardTitle className="text-xl">{dorm.name}</CardTitle>
        </Link>
        <CardDescription>{`By ${dorm.landlord.name} - ${formatDate(dorm.createdAt)}`}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default DormCard;
