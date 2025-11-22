import CardNav from './cardnav'
import logo from '../../public/logo.png';

const Navbar1 = () => {
  const items = [
    {
      label: "About",
      bgColor: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)", // Coral red to orange
      textColor: "#fff",
      links: [
        { label: "Company", href: "/about/company", ariaLabel: "About Company" },
        { label: "Careers", href: "/about/careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "linear-gradient(135deg, #FF5722 0%, #FFA726 100%)", // Vibrant red-orange to amber
      textColor: "#fff",
      links: [
        { label: "Featured", href: "/projects/featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", href: "/projects/case-studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "linear-gradient(135deg, #F44336 0%, #FF7043 100%)", // Deep red to warm orange
      textColor: "#fff",
      links: [
        { label: "Email", href: "mailto:info@example.com", ariaLabel: "Email us" },
        { label: "Twitter", href: "https://twitter.com/example", ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "https://linkedin.com/company/example", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
    <CardNav
      logo={logo.src}
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"              // White background
      menuColor="#000"              // Black menu icon
      buttonBgColor="#e7000b"          // Dark button background
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
};

export default Navbar1;