import styles from "./Header.module.scss";
console.log(styles);

export default function Header() {
  // return <div className="header">Logo | Menu</div>
  return (
    <div className={`header ${styles.header}`}>
      Logo | <a href="#">Menu</a>
    </div>
  );
}
