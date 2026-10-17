import React, { useMemo, useState } from 'react';
import { fishAssets } from '../assets/fish/fishAssets';
import { useAquariumStore } from '../context/store';

const fishData = [
  { id: 1, name: '구피', type: '담수', difficulty: '초급', habitat: '중형 어항', temperature: '24~26°C', description: '온순하고 초보자에게 적합한 인기 물고기입니다.', image: fishAssets.guppy },
  { id: 2, name: '네온 테트라', type: '담수', difficulty: '초급', habitat: '군집 어항', temperature: '22~26°C', description: '청색과 적색 줄무늬가 예쁘고 군집 생활에 잘 적응합니다.', image: fishAssets.tetra },
  { id: 3, name: '클라운피시', type: '해수', difficulty: '중급', habitat: '산호초 어항', temperature: '24~27°C', description: '사교적이고 표정이 특징적인 해수어입니다.', image: fishAssets.clownfish },
  { id: 4, name: '엔젤피시', type: '담수', difficulty: '중급', habitat: '넓은 어항', temperature: '24~27°C', description: '날개처럼 펼쳐지는 지느러미가 아름다운 열대어입니다.', image: fishAssets.angelfish },
  { id: 5, name: '금붕어', type: '담수', difficulty: '초급', habitat: '중형 어항', temperature: '25~28°C', description: '대중적이고 관리가 쉬운 대표적인 관상어입니다.', image: fishAssets.goldfish },
  { id: 6, name: '베타', type: '담수', difficulty: '초급', habitat: '단독 어항', temperature: '24~28°C', description: '화려한 지느러미와 독립적인 성격이 특징입니다.', image: fishAssets.betta },
  { id: 7, name: '코리도라스', type: '담수', difficulty: '초급', habitat: '바닥', temperature: '23~27°C', description: '바닥 환경을 정리하며 조용히 활동하는 종입니다.', image: fishAssets.corydoras },
  { id: 8, name: '플래티', type: '담수', difficulty: '초급', habitat: '중형 어항', temperature: '22~27°C', description: '활발하면서도 관리가 쉬운 대표적인 열대어입니다.', image: fishAssets.platy },
  { id: 9, name: '몰리', type: '담수', difficulty: '초급', habitat: '중형 어항', temperature: '24~28°C', description: '부드러운 움직임과 다양한 색채가 특징입니다.', image: fishAssets.molly },
  { id: 10, name: '하켄 라스보라', type: '담수', difficulty: '초급', habitat: '군집 어항', temperature: '22~26°C', description: '주황빛 줄무늬가 아름답고 군집 생활에 잘 적응합니다.', image: fishAssets.rasbora },
  { id: 11, name: '드워프 구라미', type: '담수', difficulty: '중급', habitat: '수초 어항', temperature: '24~28°C', description: '부드러운 움직임과 화려한 색이 매력적인 종입니다.', image: fishAssets.gourami },
  { id: 12, name: '코이', type: '담수', difficulty: '중급', habitat: '넓은 연못', temperature: '22~28°C', description: '화려한 색과 우아한 수영 자세가 돋보입니다.', image: fishAssets.koi },
  { id: 13, name: '제브라 다니오', type: '담수', difficulty: '초급', habitat: '군집 어항', temperature: '22~26°C', description: '검은 줄무늬가 강한 개체로 사교성이 좋습니다.', image: fishAssets.danio },
  { id: 14, name: '모엔하우시아', type: '담수', difficulty: '초급', habitat: '군집 어항', temperature: '22~26°C', description: '부드러운 수영과 안정적인 군집 생활이 가능합니다.', image: fishAssets.moenkhausia },
];

const filters = ['전체', '담수', '해수', '초급', '중급', '고급'];

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const aquariums = useAquariumStore((state) => state.aquariums);
  const addFishToAquarium = useAquariumStore((state) => state.addFishToAquarium);

  const filteredFish = useMemo(() => {
    return fishData.filter((fish) => {
      const matchesQuery = fish.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        activeFilter === '전체' ||
        fish.type === activeFilter ||
        fish.difficulty === activeFilter;

      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const handleAddFish = (fish) => {
    if (!aquariums.length) {
      alert('먼저 수조를 추가해 주세요.');
      return;
    }

    const targetAquarium = aquariums[0];
    const hasFish = (targetAquarium.Fish || []).some((item) => item.name === fish.name);

    if (hasFish) {
      alert(`${fish.name}은(는) 이미 ${targetAquarium.name}에 등록되어 있습니다.`);
      return;
    }

    addFishToAquarium(targetAquarium.id, {
      ...fish,
      id: Date.now(),
      addedAt: new Date().toISOString(),
    });

    alert(`${fish.name}이(가) ${targetAquarium.name}에 추가되었습니다.`);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">물고기 정보</p>
          <h1>검색하고 관리 정보를 확인하세요</h1>
        </div>
      </header>

      <section className="search-panel panel">
        <div className="search-input-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="물고기 이름을 입력하세요"
            aria-label="물고기 검색"
          />
        </div>

        <div className="filter-row">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? 'chip active' : 'chip'}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="fish-grid">
        {filteredFish.length > 0 ? (
          filteredFish.map((fish) => (
            <article key={fish.id} className="fish-card panel">
              <div className="fish-card-top">
                <img className="fish-icon" src={fish.image} alt={fish.name} />
                <span className="fish-tag">{fish.type}</span>
              </div>

              <h3>{fish.name}</h3>
              <p className="fish-description">{fish.description}</p>

              <ul className="fish-meta">
                <li>
                  <strong>난이도</strong>
                  <span>{fish.difficulty}</span>
                </li>
                <li>
                  <strong>서식지</strong>
                  <span>{fish.habitat}</span>
                </li>
                <li>
                  <strong>수온</strong>
                  <span>{fish.temperature}</span>
                </li>
              </ul>

              <button
                type="button"
                className="btn-primary small-btn"
                onClick={() => handleAddFish(fish)}
              >
                이 물고기 기르기
              </button>
            </article>
          ))
        ) : (
          <div className="empty-state wide-empty">
            <p>검색 결과가 없어요.</p>
            <p>다른 키워드로 다시 찾아보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}
