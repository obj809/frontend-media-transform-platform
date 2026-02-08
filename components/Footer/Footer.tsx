import { ConnectionStatus } from "@/app/types";
import "./Footer.scss";

interface FooterProps {
  status: ConnectionStatus;
}

export function Footer({ status }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">Media Transform Platform</p>
        <div className="footer__status">
          <span className={`footer__indicator footer__indicator--${status}`} />
          {status === "connected" ? "Connected" :
           status === "offline" ? "Offline" : "Checking..."}
        </div>
      </div>
    </footer>
  );
}
