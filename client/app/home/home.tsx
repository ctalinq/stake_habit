import { useTranslation } from "react-i18next";

import { Card, Link } from "~/components";
import CommitmentRow from "./commitmentRow";
import useCommitments from "~/hooks/useCommitments";
import useCommitmentVisitors from "~/hooks/useCommitmentVisitors";

export default function Home() {
  const { t } = useTranslation("home");

  const { data: commitmentsData, commitments } = useCommitments();

  const { visitorsMap } = useCommitmentVisitors({
    commitments,
    commitmentsData,
  });

  return (
    <>
      <Card className="mb-4">
        <div className="space-y-6">
          <Link
            to="/create"
            className="block w-full btn-base btn-primary text-center py-3 px-4"
            viewTransition
          >
            {t("commit")}
          </Link>
        </div>
      </Card>
      <div className="space-y-3">
        {commitments &&
          commitments.length > 0 &&
          commitments.map((commitment) => (
            <CommitmentRow
              key={commitment.commitment_address}
              commitmentAddress={commitment.commitment_address}
              visitors={visitorsMap[commitment.commitment_address]}
            />
          ))}
      </div>
    </>
  );
}
