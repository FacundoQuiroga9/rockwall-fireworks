// Width is deliberately not an input. Touch laptops are eligible; iPad desktop
// UA and Android desktop mode are checked before pointer capabilities.
export function playgroundDevice({ userAgent = '', platform = '', mobile = false, touchPoints = 0, fine = false, hover = false }) {
  const tabletOrPhone = mobile || /Android|iPhone|iPad|iPod|Tablet|Mobile|Silk/i.test(`${userAgent} ${platform}`) || (/Mac/i.test(`${platform} ${userAgent}`) && touchPoints > 1);
  if (tabletOrPhone) return 'app-preview';
  return /Windows|Mac|Linux|CrOS/i.test(`${userAgent} ${platform}`) && fine && hover ? 'desktop' : 'app-preview';
}
