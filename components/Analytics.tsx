import Script from 'next/script';
// GTM container carried over from the live WordPress site (GTM-NMPGCW4) so reporting continues across the migration.
const GTM = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-NMPGCW4';
export default function Analytics() {
  if (!GTM) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}</Script>
    </>
  );
}
