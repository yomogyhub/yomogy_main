import { ReactNode } from "react";

interface FrameTemplateProps {
  leftComponent: ReactNode;
  rightComponent: ReactNode;
}

export const FrameTemplate: React.FC<FrameTemplateProps> = ({
  leftComponent,
  rightComponent,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-start w-full items-stretch">
      <div className="flex-grow w-full lg:p-4 lg:w-auto lg:max-w-4xl mt-5 lg:mt-0 mb-8 ">
        {leftComponent}
      </div>
      <div className="flex-grow w-full lg:p-4 lg:w-auto lg:max-w-xs mb-8 ">
        {rightComponent}
      </div>
    </div>
  );
};
