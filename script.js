// 단위 정의
const units = {
    length: {
        mm: { name: '밀리미터', ratio: 1 },
        cm: { name: '센티미터', ratio: 10 },
        m: { name: '미터', ratio: 1000 },
        km: { name: '킬로미터', ratio: 1000000 },
        inch: { name: '인치', ratio: 25.4 },
        ft: { name: '피트', ratio: 304.8 }
    },
    weight: {
        mg: { name: '밀리그램', ratio: 1 },
        g: { name: '그램', ratio: 1000 },
        kg: { name: '킬로그램', ratio: 1000000 },
        oz: { name: '온스', ratio: 28349.5 },
        lb: { name: '파운드', ratio: 453592 }
    },
    temperature: {
        celsius: { name: '섭씨', convert: (val, to) => to === 'fahrenheit' ? (val * 9/5) + 32 : val + 273.15 },
        fahrenheit: { name: '화씨', convert: (val, to) => to === 'celsius' ? (val - 32) * 5/9 : ((val - 32) * 5/9) + 273.15 },
        kelvin: { name: '켈빈', convert: (val, to) => to === 'celsius' ? val - 273.15 : (val - 273.15) * 9/5 + 32 }
    }
};

// DOM 요소
const conversionType = document.getElementById('conversionType');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const fromValue = document.getElementById('fromValue');
const toValue = document.getElementById('toValue');
const favoritesList = document.getElementById('favoritesList');
const addToFavoritesBtn = document.getElementById('addToFavorites');

// 초기화
function initializeUnits() {
    const type = conversionType.value;
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    const currentUnits = units[type];
    for (const unit in currentUnits) {
        const option1 = new Option(currentUnits[unit].name, unit);
        const option2 = new Option(currentUnits[unit].name, unit);
        fromUnit.add(option1);
        toUnit.add(option2);
    }
}

// 변환 함수
function convert() {
    const type = conversionType.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value);

    if (isNaN(value)) {
        toValue.value = '';
        return;
    }

    if (type === 'temperature') {
        const result = units[type][from].convert(value, to);
        toValue.value = result.toFixed(2);
    } else {
        const fromRatio = units[type][from].ratio;
        const toRatio = units[type][to].ratio;
        const result = (value * fromRatio) / toRatio;
        toValue.value = result.toFixed(4);
    }
}

// 즐겨찾기 관리
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('unitConverterFavorites')) || [];
    favoritesList.innerHTML = '';
    
    favorites.forEach((fav, index) => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <span>${fav.type} : ${fav.fromValue} ${units[fav.type][fav.fromUnit].name} → 
            ${fav.toValue} ${units[fav.type][fav.toUnit].name}</span>
            <button onclick="removeFavorite(${index})">삭제</button>
        `;
        favoritesList.appendChild(item);
    });
}

function addToFavorites() {
    const favorites = JSON.parse(localStorage.getItem('unitConverterFavorites')) || [];
    const newFavorite = {
        type: conversionType.value,
        fromValue: fromValue.value,
        toValue: toValue.value,
        fromUnit: fromUnit.value,
        toUnit: toUnit.value
    };
    
    favorites.push(newFavorite);
    localStorage.setItem('unitConverterFavorites', JSON.stringify(favorites));
    loadFavorites();
}

function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('unitConverterFavorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('unitConverterFavorites', JSON.stringify(favorites));
    loadFavorites();
}

// 이벤트 리스너
conversionType.addEventListener('change', initializeUnits);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);
fromValue.addEventListener('input', convert);
addToFavoritesBtn.addEventListener('click', addToFavorites);

// 초기화
initializeUnits();
loadFavorites();
