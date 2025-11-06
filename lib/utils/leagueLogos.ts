// Simple cache to avoid redundant URL generation
const logoUrlCache = new Map<string, string | null>();

/**
 * Generate league logo URL based on league name 
 * This mirrors the backend logic for consistency
 */
export function getLeagueLogoUrl(leagueName: string | undefined, countryName?: string): string | null {
    // Create cache key
    const cacheKey = `${leagueName || 'undefined'}_${countryName || 'undefined'}`;
    
    // Check cache first
    if (logoUrlCache.has(cacheKey)) {
        return logoUrlCache.get(cacheKey)!;
    }
    if (!leagueName) return null;
    
    let identifier = '';
    const leagueLower = leagueName.toLowerCase();
    
    // Map specific leagues to their icon identifiers (same logic as backend)
    if (leagueLower.includes('wta') || leagueLower.includes('women')) {
        identifier = 'WTA1';
    } else if (leagueLower.includes('al ain') || leagueLower.includes('master de al ain') || leagueLower.includes('masters de al ain')) {
        identifier = 'AE'; // UAE flag for Al Ain tournaments
    } else if (leagueLower.includes('atp') || leagueLower.includes('masters')) {
        identifier = 'ATP1';
    } else if (leagueLower.includes('champions league') || leagueLower.includes('uefa')) {
        identifier = 'UEFA1';
    } else if (leagueLower.includes('nba')) {
        identifier = 'NBA2';
    } else if (leagueLower.includes('liga pro')) {
        identifier = 'CZ'; // República Checa based on mock data
    } else if (leagueLower.includes('npb')) {
        identifier = 'JP'; // Japan based on mock data
    } 
    // Specific league mappings
    else if (leagueLower.includes('nbl república checa') || leagueLower.includes('nbl republica checa')) {
        identifier = 'CZ'; // Czech Republic
    } else if (leagueLower.includes('afc champions league')) {
        identifier = 'INT2'; // AFC Champions League - Asian international competition
    } else if (leagueLower.includes('hockeyallsvenskan') || leagueLower.includes('hockey allsvenskan')) {
        identifier = 'SE'; // Sweden hockey
    } else if (leagueLower.includes('hockeyettan') || leagueLower.includes('hockey ettan')) {
        identifier = 'SE'; // Sweden hockey
    } else if (leagueLower.includes('h2h gg league') || leagueLower.includes('gg league')) {
        identifier = 'FIFA'; // FIFA esports/virtual football
    } 
    // Country/region specific mappings
    else if (leagueLower.includes('república checa') || leagueLower.includes('republica checa') || leagueLower.includes('czech')) {
        identifier = 'CZ'; // Czech Republic
    } else if (leagueLower.includes('a1 croacia') || leagueLower.includes('croacia') || leagueLower.includes('croatia')) {
        identifier = 'HR'; // Croatia
    } else if (leagueLower.includes('basketligen') || (leagueLower.includes('sweden') || leagueLower.includes('suecia')) && leagueLower.includes('basket')) {
        identifier = 'SE'; // Sweden
    } else if (leagueLower.includes('allsvenskan') || leagueLower.includes('svenska')) {
        identifier = 'SE'; // Sweden
    } else if (leagueLower.includes('estonia') && leagueLower.includes('letonia')) {
        identifier = 'EE'; // Estonia-Latvia league, use Estonia flag
    } else if (leagueLower.includes('fiba europe') || leagueLower.includes('europe cup')) {
        identifier = 'INT1'; // International European competition
    } else if (leagueLower.includes('liga europea') || leagueLower.includes('european league')) {
        identifier = 'INT1'; // European league
    } else if (leagueLower.includes('superliga polonia') || leagueLower.includes('polonia') || leagueLower.includes('poland')) {
        identifier = 'PL'; // Poland
    } 
    // Generic sport/competition type mappings
    else if (leagueLower.includes('fifa') || leagueLower.includes('virtual football') || leagueLower.includes('e-football')) {
        identifier = 'FIFA'; // FIFA/Virtual football
    } else if (leagueLower.includes('champions') && leagueLower.includes('asia')) {
        identifier = 'INT2'; // Asian Champions competitions
    } else if (leagueLower.includes('euro') && (leagueLower.includes('cup') || leagueLower.includes('league'))) {
        identifier = 'INT1'; // European competitions
    } else if (leagueLower.includes('international') || leagueLower.includes('mundial') || leagueLower.includes('world')) {
        identifier = 'INT1'; // International competitions
    } 
    // Hockey specific mappings by country
    else if (leagueLower.includes('hockey') && (leagueLower.includes('sweden') || leagueLower.includes('sve'))) {
        identifier = 'SE'; // Swedish hockey
    } else if (leagueLower.includes('hockey') && (leagueLower.includes('finland') || leagueLower.includes('fin'))) {
        identifier = 'FI'; // Finnish hockey
    } else if (leagueLower.includes('hockey') && (leagueLower.includes('czech') || leagueLower.includes('cze'))) {
        identifier = 'CZ'; // Czech hockey
    } else if (leagueLower.includes('hockey') && (leagueLower.includes('poland') || leagueLower.includes('pol'))) {
        identifier = 'PL'; // Polish hockey
    } else if (countryName) {
        // Try to map country name to country code
        const countryLower = countryName.toLowerCase();
        if (countryLower.includes('españa') || countryLower.includes('spain')) {
            identifier = 'ES';
        } else if (countryLower.includes('inglaterra') || countryLower.includes('england') || countryLower.includes('reino unido')) {
            identifier = 'GB';
        } else if (countryLower.includes('alemania') || countryLower.includes('germany')) {
            identifier = 'DE';
        } else if (countryLower.includes('francia') || countryLower.includes('france')) {
            identifier = 'FR';
        } else if (countryLower.includes('italia') || countryLower.includes('italy')) {
            identifier = 'IT';
        } else if (countryLower.includes('portugal')) {
            identifier = 'PT';
        } else if (countryLower.includes('holanda') || countryLower.includes('netherlands')) {
            identifier = 'NL';
        } else if (countryLower.includes('brasil') || countryLower.includes('brazil')) {
            identifier = 'BR';
        } else if (countryLower.includes('argentina')) {
            identifier = 'AR';
        } else if (countryLower.includes('méxico') || countryLower.includes('mexico')) {
            identifier = 'MX';
        } else if (countryLower.includes('estados unidos') || countryLower.includes('usa')) {
            identifier = 'US';
        } else if (countryLower.includes('polonia') || countryLower.includes('poland')) {
            identifier = 'PL';
        } else if (countryLower.includes('república checa') || countryLower.includes('czech')) {
            identifier = 'CZ';
        } else if (countryLower.includes('estonia')) {
            identifier = 'EE';
        } else if (countryLower.includes('letonia') || countryLower.includes('latvia')) {
            identifier = 'LV';
        } else {
            // Default fallback - use first two characters of country name
            identifier = countryName
                .replace(/[^a-zA-Z]/g, '')
                .substring(0, 2)
                .toUpperCase();
        }
    } else {
        // Default fallback - use first two characters of league name
        identifier = leagueName
            .replace(/[^a-zA-Z]/g, '')
            .substring(0, 2)
            .toUpperCase();
    }
    
    if (!identifier) {
        logoUrlCache.set(cacheKey, null);
        return null;
    }
    
    // Generate the Codere URL (same pattern as backend)
    const url = `https://m.codere.com.co/deportesCol/assets/global/img/banderas/ICO_${identifier}.png`;
    
    // Cache the result
    logoUrlCache.set(cacheKey, url);
    
    return url;
}

// Simple cache for country logos too
const countryLogoUrlCache = new Map<string, string | null>();

/**
 * Generate country flag URL based on country name
 * Uses the same Codere pattern as league logos
 */
export function getCountryLogoUrl(countryName: string | undefined): string | null {
    // Create cache key
    const cacheKey = countryName || 'undefined';
    
    // Check cache first
    if (countryLogoUrlCache.has(cacheKey)) {
        return countryLogoUrlCache.get(cacheKey)!;
    }
    if (!countryName) return null;
    
    let identifier = '';
    const countryLower = countryName.toLowerCase();
    
    // Map country names to country codes
    if (countryLower.includes('españa') || countryLower.includes('spain')) {
        identifier = 'ES';
    } else if (countryLower.includes('inglaterra') || countryLower.includes('england') || countryLower.includes('reino unido') || countryLower.includes('united kingdom')) {
        identifier = 'GB';
    } else if (countryLower.includes('alemania') || countryLower.includes('germany')) {
        identifier = 'DE';
    } else if (countryLower.includes('francia') || countryLower.includes('france')) {
        identifier = 'FR';
    } else if (countryLower.includes('italia') || countryLower.includes('italy')) {
        identifier = 'IT';
    } else if (countryLower.includes('portugal')) {
        identifier = 'PT';
    } else if (countryLower.includes('holanda') || countryLower.includes('netherlands') || countryLower.includes('países bajos')) {
        identifier = 'NL';
    } else if (countryLower.includes('brasil') || countryLower.includes('brazil')) {
        identifier = 'BR';
    } else if (countryLower.includes('argentina')) {
        identifier = 'AR';
    } else if (countryLower.includes('méxico') || countryLower.includes('mexico')) {
        identifier = 'MX';
    } else if (countryLower.includes('estados unidos') || countryLower.includes('usa') || countryLower.includes('united states')) {
        identifier = 'US';
    } else if (countryLower.includes('polonia') || countryLower.includes('poland')) {
        identifier = 'PL';
    } else if (countryLower.includes('república checa') || countryLower.includes('czech republic') || countryLower.includes('czech')) {
        identifier = 'CZ';
    } else if (countryLower.includes('estonia')) {
        identifier = 'EE';
    } else if (countryLower.includes('letonia') || countryLower.includes('latvia')) {
        identifier = 'LV';
    } else if (countryLower.includes('finlandia') || countryLower.includes('finland')) {
        identifier = 'FI';
    } else if (countryLower.includes('eslovaquia') || countryLower.includes('slovakia')) {
        identifier = 'SK';
    } else if (countryLower.includes('internacional') || countryLower.includes('international')) {
        identifier = 'INT1'; // International events
    } else if (countryLower.includes('japón') || countryLower.includes('japan')) {
        identifier = 'JP';
    } else if (countryLower.includes('corea') || countryLower.includes('korea')) {
        identifier = 'KR';
    } else if (countryLower.includes('china')) {
        identifier = 'CN';
    } else if (countryLower.includes('rusia') || countryLower.includes('russia')) {
        identifier = 'RU';
    } else if (countryLower.includes('ucrania') || countryLower.includes('ukraine')) {
        identifier = 'UA';
    } else if (countryLower.includes('turquía') || countryLower.includes('turkey')) {
        identifier = 'TR';
    } else if (countryLower.includes('grecia') || countryLower.includes('greece')) {
        identifier = 'GR';
    } else if (countryLower.includes('suecia') || countryLower.includes('sweden')) {
        identifier = 'SE';
    } else if (countryLower.includes('noruega') || countryLower.includes('norway')) {
        identifier = 'NO';
    } else if (countryLower.includes('dinamarca') || countryLower.includes('denmark')) {
        identifier = 'DK';
    } else if (countryLower.includes('bélgica') || countryLower.includes('belgium')) {
        identifier = 'BE';
    } else if (countryLower.includes('suiza') || countryLower.includes('switzerland')) {
        identifier = 'CH';
    } else if (countryLower.includes('austria')) {
        identifier = 'AT';
    } else if (countryLower.includes('hungría') || countryLower.includes('hungary')) {
        identifier = 'HU';
    } else if (countryLower.includes('rumania') || countryLower.includes('romania')) {
        identifier = 'RO';
    } else if (countryLower.includes('bulgaria')) {
        identifier = 'BG';
    } else if (countryLower.includes('croacia') || countryLower.includes('croatia')) {
        identifier = 'HR';
    } else if (countryLower.includes('serbia')) {
        identifier = 'RS';
    } else if (countryLower.includes('bosnia') || countryLower.includes('herzegovina')) {
        identifier = 'BA';
    } else if (countryLower.includes('eslovenia') || countryLower.includes('slovenia')) {
        identifier = 'SI';
    } else if (countryLower.includes('macedonia')) {
        identifier = 'MK';
    } else if (countryLower.includes('albania')) {
        identifier = 'AL';
    } else if (countryLower.includes('montenegro')) {
        identifier = 'ME';
    } else if (countryLower.includes('kosovo')) {
        identifier = 'XK';
    } else if (countryLower.includes('lituania') || countryLower.includes('lithuania')) {
        identifier = 'LT';
    } else if (countryLower.includes('moldavia') || countryLower.includes('moldova')) {
        identifier = 'MD';
    } else if (countryLower.includes('chipre') || countryLower.includes('cyprus')) {
        identifier = 'CY';
    } else if (countryLower.includes('malta')) {
        identifier = 'MT';
    } else if (countryLower.includes('luxemburgo') || countryLower.includes('luxembourg')) {
        identifier = 'LU';
    } else if (countryLower.includes('irlanda') || countryLower.includes('ireland')) {
        identifier = 'IE';
    } else if (countryLower.includes('islandia') || countryLower.includes('iceland')) {
        identifier = 'IS';
    } else {
        // Default fallback - use first two characters of country name
        identifier = countryName
            .replace(/[^a-zA-Z]/g, '')
            .substring(0, 2)
            .toUpperCase();
    }
    
    if (!identifier) {
        countryLogoUrlCache.set(cacheKey, null);
        return null;
    }
    
    // Generate the Codere URL (same pattern as league logos)
    const url = `https://m.codere.com.co/deportesCol/assets/global/img/banderas/ICO_${identifier}.png`;
    
    // Cache the result
    countryLogoUrlCache.set(cacheKey, url);
    
    return url;
}