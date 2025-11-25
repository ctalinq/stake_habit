import { useTranslation } from "react-i18next";
import Spinner from "~/components/icons/spinner.svg?react";
import { Modal } from "~/components";

const DeployCommitmentModal = ({ isOpen }: { isOpen: boolean }) => {
  const { t } = useTranslation("create");

  return (
    <Modal
      showCloseButton={false}
      modalClassName="w-90 space-y-4 flex flex-col items-center"
      isOpen={isOpen}
      onClose={() => {}}
    >
      <p className="text-center mb-9 text-black dark:text-white">
        {t("commitmentDeploymentModal.text")}
        <br />
        <span className="text-2xl">☝</span>
        <br />
        {t("commitmentDeploymentModal.doNotClose")}
        <br />
        {t("commitmentDeploymentModal.interupting")}
        <Spinner className="mx-auto mt-4 dark:fill-white w-12 h-12" />
      </p>
    </Modal>
  );
};

export default DeployCommitmentModal;
