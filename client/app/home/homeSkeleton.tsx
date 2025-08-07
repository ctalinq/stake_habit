import React from "react";
import { Container, Card } from "../components";

export default function HomeSkeleton() {
  return (
    <Container>
      <div className="w-16 h-16 skeleton-circle shadow-lg absolute top-20 left-5" />
      <Card className="mt-30">
        <div className="space-y-6">
          <div className="h-12 skeleton rounded-xl w-full" />
          <div className="h-12 skeleton rounded-xl w-full" />
        </div>
      </Card>
    </Container>
  );
}
