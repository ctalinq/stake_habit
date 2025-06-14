import React from "react";
import { Container, Card } from "../components";

export default function HomeSkeleton() {
  return (
    <Container>
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <div className="h-8 animate-pulse bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-4" />
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-lg" />
            </div>
          </div>

          <div className="h-12 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-xl w-full" />
        </div>
      </Card>
    </Container>
  );
}
