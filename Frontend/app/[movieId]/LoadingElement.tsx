import React from 'react';

type Props = {
  className?: string;
};

export default function LoadingElement({ className }: Props) {
  return (
    <div className={`cssload-fond ${className}`}>
      <div className="cssload-container-general">
        <div className="cssload-internal">
          <div className="cssload-ballcolor cssload-ball_1"> </div>
        </div>
        <div className="cssload-internal">
          <div className="cssload-ballcolor cssload-ball_2"> </div>
        </div>
        <div className="cssload-internal">
          <div className="cssload-ballcolor cssload-ball_3"> </div>
        </div>
        <div className="cssload-internal">
          <div className="cssload-ballcolor cssload-ball_4"> </div>
        </div>
      </div>
    </div>
  );
}
