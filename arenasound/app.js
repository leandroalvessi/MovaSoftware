const repoOwner = 'leandroalvessi';
const repoName = 'ArenaSoundRelease';
const repoUrl = `https://github.com/${repoOwner}/${repoName}`;
const latestReleaseUrl = `${repoUrl}/releases/latest`;
const releasesUrl = `${repoUrl}/releases`;
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

const directDownloadUrls = {
  windows: `${repoUrl}/releases/latest/download/ArenaSoundSetup.exe`,
  mac: `${repoUrl}/releases/latest/download/ArenaSound.dmg`,
  linux: `${repoUrl}/releases/latest/download/ArenaSound.AppImage`
};

const platformMatchers = {
  windows: [/\.exe$/i, /setup/i, /installer/i],
  mac: [/\.dmg$/i],
  linux: [/\.appimage$/i]
};

const downloadCards = Array.from(document.querySelectorAll('.dl-card'));
const allReleasesLinkNode = document.getElementById('allReleasesLink');

function getFallbackUrl(platform) {
  return directDownloadUrls[platform] || latestReleaseUrl;
}

function findAsset(assets, platform) {
  const matchers = platformMatchers[platform] || [];

  return assets.find((asset) => matchers.some((matcher) => matcher.test(asset.name)));
}

function setCardLink(card, asset, releasePageUrl, tagName) {
  const subtitleNode = card.querySelector('.dl-ext');
  const buttonNode = card.querySelector('.dl-btn');

  card.classList.remove('is-missing');

  if (asset) {
    card.href = asset.browser_download_url;
    card.title = `Baixar ${asset.name}`;
    
    // Formata o subtítulo de forma amigável ao invés do nome bruto do arquivo
    const platform = card.dataset.platform;
    const versionSuffix = tagName ? ` (${tagName})` : '';
    if (platform === 'windows') {
      subtitleNode.textContent = `Instalador .exe${versionSuffix}`;
    } else if (platform === 'mac') {
      subtitleNode.textContent = `Imagem .dmg${versionSuffix}`;
    } else if (platform === 'linux') {
      subtitleNode.textContent = `AppImage${versionSuffix}`;
    } else {
      subtitleNode.textContent = asset.name;
    }
    
    buttonNode.textContent = 'Baixar agora';
    return;
  }

  card.classList.add('is-missing');
  card.href = releasePageUrl;
  card.title = 'Abrir página da release mais recente';
  buttonNode.textContent = 'Ver release';
}

async function loadRelease() {
  if (allReleasesLinkNode) {
    allReleasesLinkNode.href = releasesUrl;
  }

  for (const card of downloadCards) {
    card.href = getFallbackUrl(card.dataset.platform);
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API respondeu com ${response.status}`);
    }

    const release = await response.json();
    const assets = Array.isArray(release.assets) ? release.assets : [];
    const releasePageUrl = release.html_url || latestReleaseUrl;
    const tagName = release.tag_name || '';

    for (const card of downloadCards) {
      const asset = findAsset(assets, card.dataset.platform);
      setCardLink(card, asset, releasePageUrl, tagName);
    }
  } catch (error) {
    for (const card of downloadCards) {
      card.classList.add('is-missing');
      card.href = getFallbackUrl(card.dataset.platform);
      card.title = 'Baixar instalador';
    }

    console.error(error);
  }
}

loadRelease();
