/**
 * 관리자가 올린 그림은 주소, 파일, data URL 이 섞이므로 next/image 대신 img 를 쓴다.
 */
export default function CmsImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
