import Link from "next/link";
import React from "react";
import {
  Dropdown,
  Container,
  Form,
  Nav,
  Navbar,
  InputGroup,
} from "react-bootstrap";
import Selectoptions from "./HeaderData";
import users2 from "../../public/assets/img/users/2.jpg";
import users3 from "../../public/assets/img/users/3.jpg";
import users5 from "../../public/assets/img/users/5.jpg";
import DefaultImg from '/public/assets/img/app/default.png'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const HeadDropDown = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    // console.log(data.name)
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  }
  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  const Darkmode = () => {
    document.querySelector("body").classList.toggle("dark-theme");
    document.querySelector("#myonoffswitch2").checked = true;
    if (document.body.classList.contains("dark-theme")) {
      localStorage.setItem("Spruhadark", true);
      document.querySelector("#myonoffswitch2").checked = true;
      document.querySelector("#myonoffswitch8").checked = true;
      document.querySelector("#myonoffswitch5").checked = true;
    } else {
      localStorage.removeItem("Spruhadark");
      document.querySelector("#myonoffswitch2").checked = false;
      document.querySelector("#myonoffswitch8").checked = false;
      document.querySelector("#myonoffswitch6").checked = true;
    }
  };

  const openCloseSidebar1 = () => {
    document.querySelector(".header-settings").classList.toggle("show");
    document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  };

  return (
    <div className="d-flex order-lg-2 align-items-center ms-auto">
      <div className="d-md-flex">
        <div className="nav-link icon full-screen-link" onClick={Fullscreen}>
          <i className="fe fe-maximize fullscreen-button fullscreen header-icons"></i>
          <i className="fe fe-minimize fullscreen-button exit-fullscreen header-icons"></i>
        </div>
      </div>
      <Dropdown className=" main-header-notification">
        <Dropdown.Toggle className="nav-link icon" href="#!" variant="default">
          <i className="fe fe-bell header-icons"></i>
          {/* <span className="badge bg-danger nav-link-badge">4</span> */}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ margin: 0 }}>
          <div className="header-navheading">
            <p className="main-notification-text">
              You have 1 unread notification
              <span className="badge bg-pill bg-primary ms-3">View all</span>
            </p>
          </div>
          <div className="main-notification-list">
            <Link href={`/components/advancedui/chat`}>
              <div className="media new">
                <div className="main-img-user online">
                  <img alt="avatar" src={users5.src} />
                </div>
                <div className="media-body">
                  <p>
                    Congratulate <strong>Olivia James</strong> for New template
                    start
                  </p>
                  <span>Oct 15 12:32pm</span>
                </div>
              </div>
            </Link>
            <Link href={`/components/advancedui/chat`}>
              <div className="media">
                <div className="main-img-user">
                  <img alt="avatar" src={users2.src} />
                </div>
                <div className="media-body">
                  <p>
                    <strong>Joshua Gray</strong> New Message Received
                  </p>
                  <span>Oct 13 02:56am</span>
                </div>
              </div>
            </Link>
            <Link href={`/components/advancedui/chat`}>
              <div className="media">
                <div className="main-img-user online">
                  <img alt="avatar" src={users3.src} />
                </div>
                <div className="media-body">
                  <p>
                    <strong>Elizabeth Lewis</strong> added new schedule realease
                  </p>
                  <span>Oct 12 10:40pm</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="dropdown-footer">
            <Link href={`/components/advancedui/chat`}>
              View All Notifications
            </Link>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown className="main-profile-menu">
        <Dropdown.Toggle className="d-flex p-0" variant="default">
          <span className="main-img-user mx-1">
            <img alt="avatar" src={userData?.avatar_url ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}${userData?.avatar_url}` : DefaultImg?.src} />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ margin: "0px" }}>
          <div className="header-navheading">
            <h6 className="main-notification-title">
              {userData ? userData.name : ""}
            </h6>
            <p className="main-notification-text">
              {userData?.role == 1
                ? "Admin"
                : userData?.role == 2
                ? "Flood management team"
                : userData?.role == 3
                ? "Quick response team"
                : userData?.role == 4
                ? "Camp"
                : "User"}
            </p>
          </div>

          <Dropdown.Item className="border-top">
            <Link href={`/users/profile/`}>
              <i className="fe fe-user"></i> My Profile
            </Link>
          </Dropdown.Item>
          <Dropdown.Item onClick={logout}>
            <i className="fe fe-power"></i> Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default HeadDropDown;
