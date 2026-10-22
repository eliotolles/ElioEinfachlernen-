'use strict';
const VocabCatalog={
 labels:{vi:{topic:'Theo chủ đề',level:'Theo cấp độ',industry:'Theo chuyên ngành',mine:'Của tôi',all:'Tất cả nguồn'},en:{topic:'By topic',level:'By level',industry:'By profession',mine:'My vocabulary',all:'All sources'},de:{topic:'Nach Thema',level:'Nach Niveau',industry:'Nach Beruf',mine:'Meine Wörter',all:'Alle Quellen'}},
 route(hash){const params=new URLSearchParams(String(hash||'').replace(/^#/,''));return {deck:params.get('deck')||'',catalog:['topic','level','industry','mine'].includes(params.get('catalog'))?params.get('catalog'):'topic'};},
 deckHref(id,catalog){return 'wortschatz.html#'+new URLSearchParams({deck:id,catalog:['topic','level','industry','mine'].includes(catalog)?catalog:'topic'}).toString();},
 levels:['A1','A2','B1','B2','C1','C2'],
 industries:['Điều dưỡng','Nhà hàng, khách sạn','Bán hàng','Mẫu câu bán hàng','Trợ lý nha khoa','Xây dựng','Nghề nail','Đầu bếp','Khách sạn','Công nghệ ô tô','Lái xe ô tô','Cơ khí','Công nghệ và điện tử','Điện','Kinh doanh','Khoa học','Trường học và giáo dục','Chính trị','Toán học','Khoa học máy tính','Vật liệu'],
 source(collection){return ['topic','level','industry'].includes(collection?.catalog)?collection.catalog:'mine';},
 decks(vocab,materials){const map=new Map(),collections=new Map(materials.filter(c=>c.type==='vocabulary').map(c=>[c.id,c]));for(const w of vocab){const id=w.deckId||'default',c=collections.get(id);if(!map.has(id))map.set(id,{id,name:c?.name||w.deckName||'Meine Wörter',source:this.source(c),category:c?.category||'',level:c?.level||w.level||'',items:[]});map.get(id).items.push(w);}for(const c of collections.values())if(!map.has(c.id))map.set(c.id,{id:c.id,name:c.name,source:this.source(c),category:c.category||'',level:c.level||'',items:[]});return [...map.values()];},
 matches(collection,context){return this.source(collection)===(context?.catalog||'mine')&&(!context?.catalog||(collection.category||'')===(context.category||''));},
 context(root,source){if(Account.profile?.role!=='super_admin')throw Error('Chỉ Admin được import vào kho chung.');const category=root.querySelector('[data-category]').value.trim(),level=source==='level'?category.toUpperCase():'';if(!category)throw Error('Chọn hoặc nhập nhóm đích trước khi import.');return {catalog:source,category,level};}
};
