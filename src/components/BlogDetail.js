import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/Blog.css";

import dogAdoption from "../assests/images/blog/1.jpg";
import catFood from "../assests/images/blog/2.jpg";
import petVaccination from "../assests/images/blog/4.jpg";
import petAsı from "../assests/images/blog/6.jpg";
import pet5 from "../assests/images/blog/5.jpg";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  // Blog yazıları — kullanıcı tarafından sağlanan örnek yazı
  const blogPosts = useMemo(
    () => [
      {
        id: 1,
        title:
          "Kediler Neden Mırlar? Küçük Bir Motor Sesi Gibi Gelen Büyük Bir İletişim Dili",
        content: `
        <p>Bir kediyle aynı evde yaşayan herkesin çok iyi bildiği bir ses vardır: mırlama. Bazen koltuğa kıvrıldığında, bazen mama kabının yanında beklerken, bazen de kendini sevdirmek için gelip insanın dizine yerleştiğinde o tanıdık titreşim başlar. İlk bakışta “mutlu kedi sesi” gibi görünür ama işin içine biraz veterinerlik ve davranış bilimi girince konu daha ilginç hale gelir. Çünkü mırlama sadece keyifli bir anın fon müziği değildir; iletişim, rahatlama, sosyal bağ ve bazen de stresle baş etme davranışıyla ilişkili karmaşık bir sinyaldir.</p>

        <h2>Mırlama sadece mutluluk belirtisi mi?</h2>
        <p>Kediler çoğu zaman rahat ve güvende hissettiklerinde mırlar. Sahibinin yanında uzanmak, okşanmak, güneş alan bir köşede uyuklamak ya da yavruyken annesiyle temas kurmak mırlamayı tetikleyebilir. Ancak veteriner kliniklerinde görülen kediler bazen korku, ağrı ya da hastalık sırasında da mırlayabilir. Yani mırlama tek başına “her şey yolunda” anlamına gelmez. Kedinin beden dili, iştahı, hareketleri ve genel davranışıyla birlikte değerlendirilmelidir.</p>

        <h2>Bu ses nasıl çıkıyor?</h2>
        <p>Mırlamanın mekanizması uzun süre merak konusu olmuştur. Günümüzde en yaygın kabul gören açıklamaya göre sesin oluşumunda gırtlak, gırtlak kasları ve sinir sistemi tarafından düzenlenen ritmik uyarılar rol oynar. Kedi nefes alıp verirken bu ritmik kas hareketleri titreşim oluşturur. Bu yüzden mırlama sadece dışarıdan duyulan bir ses değil, aynı zamanda kedinin vücudunda hissedilen küçük bir titreşim gibidir. Bir kediyi severken elinizin altında hafif bir “motor” çalışıyormuş gibi hissetmenizin nedeni de budur.</p>

        <h2>Yavru kediler için ilk iletişim yollarından biri</h2>
        <p>Mırlama, kedilerde çok erken dönemde ortaya çıkan davranışlardan biridir. Yavru kedi, annesine yakın olduğunu, emdiğini ve güvende olduğunu bu yolla belli edebilir. Anne kedi de yavrularıyla temas halindeyken mırlayabilir. Bu durum, mırlamanın sosyal bağ kurma işlevini düşündürür. Yani kedi büyüdükten sonra sahibinin yanında mırladığında, bu davranışın arkasında yalnızca “beni sev” mesajı değil, aynı zamanda “senin yanında güvendeyim” duygusu da olabilir.</p>

        <h2>Mırlama bazen yardım çağrısı olabilir</h2>
        <p>Kedilerin en şaşırtıcı taraflarından biri, rahatsız olduklarında da sakin görünmeyi başarabilmeleridir. Doğada zayıflık göstermek tehlikeli olabileceği için kediler ağrılarını çok açık belli etmeyebilir. Bu nedenle hasta bir kedinin mırlaması yanıltıcı olabilir. Kediniz normalden farklı şekilde saklanıyor, az yiyor, tuvalet alışkanlığı değişiyor, dokununca tepki veriyor ya da halsiz görünüyorsa mırlaması onu iyi hissettiği anlamına gelmeyebilir. Böyle durumlarda “mırlıyor, demek ki iyidir” diye düşünmek yerine veteriner hekime danışmak daha doğru olur.</p>

        <h2>İnsanlarla özel bir iletişim kuruyor olabilirler</h2>
        <p>Kediler insanlarla yaşadıkça bazı davranışlarını bizim tepkilerimize göre şekillendirebilir. Bazı kediler mama istemek için daha ısrarlı, daha tiz ya da daha dikkat çekici bir mırlama-miyavlama karışımı ses çıkarabilir. Bu sesler sahibin dikkatini çekmekte oldukça başarılıdır. Kısacası kediler bazen sadece sevimli oldukları için değil, bizi nasıl harekete geçireceklerini iyi öğrendikleri için de mırlar. Sabahın erken saatinde mama kabının başında çalışan o küçük motor, sandığımızdan daha stratejik olabilir.</p>

        <h2>Mırlama ve beden dili birlikte okunmalı</h2>
        <p>Bir kedinin ne hissettiğini anlamak için sadece kulağımızı değil, gözümüzü de kullanmamız gerekir. Kuyruğun pozisyonu, kulakların yönü, göz bebeklerinin büyüklüğü, vücudun gevşek ya da gergin olması önemli ipuçları verir. Gevşek vücut, yarı kapalı gözler ve yumuşak patilerle gelen mırlama genellikle huzurlu bir tabloyu gösterir. Ama kulaklar geriye yatmış, vücut kasılmış, kuyruk hızlı hızlı sallanıyorsa aynı mırlama bambaşka bir ruh haline eşlik ediyor olabilir.</p>

        <h2>Klinik açıdan neden önemli?</h2>
        <p>Veteriner hekimlikte davranışları doğru okumak çok önemlidir. Çünkü kedi hastalar çoğu zaman köpekler kadar açık sinyal vermez. Kedinin mırlaması, klinikte muayeneyi zorlaştırabilir; örneğin kalp ve solunum seslerini dinlerken bu titreşim sesleri karıştırabilir. Ayrıca stresli bir kedinin sessizce beklemesi, onun sakin olduğu anlamına gelmeyebilir. Bu yüzden günümüzde kedi dostu muayene yaklaşımlarında hayvanın stresini azaltmak, ortamı sakinleştirmek ve beden dilini doğru yorumlamak üzerinde özellikle durulur.</p>

        <h2>Sonuç</h2>
        <p>Kedilerin mırlaması, tek cümleyle açıklanamayacak kadar zengin bir davranıştır. Evet, çoğu zaman mutluluğun ve rahatlığın işaretidir; ama bazen stres, ağrı, korku ya da ilgi isteğiyle de ilişkili olabilir. Bu yüzden mırlamayı “kedi gülümsüyor” diye düşünmek tatlı ama eksik bir yorum olur. Daha doğru yorum şudur: Kedi bizimle kendi dilinde konuşuyor. Bize düşen ise bu sesi, beden dili ve genel sağlık belirtileriyle birlikte okuyabilmektir. Çünkü bazen küçük bir mırlama, kocaman bir “iyiyim” demek olabilir; bazen de sessiz bir “beni fark et” çağrısıdır.</p>
      `,
        image: pet5,
        date: "14 Mayıs 2026",
        category: "Kediler",
        author: "Zeynep Çoban (Veteriner Hekim Öğrencisi)",
        tags: ["mırlama", "kedi", "davranış"],
      },
      {
        id: 2,
        title:
          "Köpekler İnsanların Duygularını Gerçekten Anlar mı? Bakışlardan Kuyruk Sallamaya Uzanan Bilimsel Bir Hikaye",
        content: `
        <p>Bir köpeğin en etkileyici yönlerinden biri, insanın ruh halini sezebiliyormuş gibi davranmasıdır. Üzgünken yanımıza gelip sessizce oturması, heyecanlandığımızda o da coşması ya da kızgın bir ses tonunda hemen duraksaması çoğu hayvan sahibinin yaşadığı tanıdık anlardandır. Peki bu gerçekten “duygularımızı anlamak” mıdır, yoksa köpekler sadece alışkanlıklarımızı ve beden dilimizi mi okur? Bilimsel çalışmalar, bu sorunun cevabının oldukça ilginç olduğunu gösteriyor: Köpekler, insan yüz ifadelerini, ses tonunu ve beden dilini birlikte değerlendirerek duygusal durumlar hakkında ipucu çıkarabilir.</p>

        <h2>Köpekler bizi uzun zamandır izliyor</h2>
        <p>Köpeklerle insanların ilişkisi binlerce yıl öncesine dayanır. Bu uzun ortak yaşam, köpeklerin insan davranışlarına karşı çok duyarlı hale gelmesine katkı sağlamış olabilir. Bir köpek için sahibinin yüzü, sesi, yürüyüş şekli ve günlük rutini önemli bilgiler taşır. Mama saatini, yürüyüş hazırlığını ya da sahibinin eve yorgun gelişini fark etmesi sadece tesadüf değildir. Köpekler çevrelerindeki insanları sürekli gözlemler ve davranış kalıplarını öğrenir.</p>

        <h2>Yüz ifadelerini ayırt edebilirler mi?</h2>
        <p>Köpeklerin insan yüz ifadelerini ayırt edebildiğine dair önemli çalışmalar vardır. 2015 yılında yayımlanan bir araştırmada köpeklerin mutlu ve kızgın insan yüzlerini birbirinden ayırabildiği gösterilmiştir. Üstelik köpekler yalnızca ezberlenmiş bir fotoğrafı tanımamış, yeni yüzlerde de benzer duygusal ifadeleri ayırt edebilmiştir. Bu, köpeklerin insan yüzünü basit bir görüntü olarak değil, anlam taşıyan bir sosyal işaret olarak değerlendirebildiğini düşündürür.</p>

        <h2>Ses tonu da çok şey anlatır</h2>
        <p>Köpek sahipleri bunu zaten günlük hayatta bilir: Aynı kelimeyi farklı ses tonlarıyla söylediğinizde köpeğinizin tepkisi değişebilir. “Aferin” kelimesi yumuşak ve neşeli söylendiğinde kuyruk sallatan bir ödül gibi algılanırken, sert ve gergin bir ton köpeği huzursuz edebilir. Bilimsel çalışmalar da köpeklerin sadece yüz ifadelerine değil, seslerdeki duygusal tona da dikkat ettiğini gösterir. Yani köpekler için ne söylediğimiz kadar nasıl söylediğimiz de önemlidir.</p>

        <h2>Yüz ve sesi birleştirme becerisi</h2>
        <p>2016 yılında Biology Letters dergisinde yayımlanan bir çalışma, köpeklerin insan ve köpek duygularını farklı duyusal ipuçlarını birleştirerek değerlendirebildiğini bildirmiştir. Araştırmada köpeklerin yüz ifadeleriyle seslerin duygusal uyumuna dikkat ettiği görülmüştür. Bu bulgu önemli çünkü duygu tanımanın yalnızca tek bir işarete bağlı olmadığını, köpeklerin farklı kaynaklardan gelen bilgileri bir araya getirebildiğini düşündürür. Başka bir deyişle köpekler, yüzümüzü ve sesimizi aynı anda okuyabilen dikkatli gözlemcilerdir.</p>

        <h2>Bu empati mi?</h2>
        <p>Burada dikkatli olmak gerekir. Köpeğin üzgün sahibinin yanına gelmesi çok duygusal ve anlamlı bir davranıştır; ancak bunu insanlardaki karmaşık empatiyle birebir aynı kabul etmek doğru olmayabilir. Köpekler insanın duygu durumunu sezebilir, buna uygun tepki verebilir ve geçmiş deneyimlerine göre davranış geliştirebilir. Fakat “sahibim bugün okulda kötü bir gün geçirdi, bu yüzden ona moral vermeliyim” gibi insan tarzı bir düşünce kurduklarını söylemek bilimsel olarak fazla iddialı olabilir.</p>
      `,
        image: dogAdoption,
        date: "14 Mayıs 2026",
        category: "Köpekler",
        author: "Zeynep Çoban (Veteriner Hekim Öğrencisi)",
        tags: ["köpek", "duygu", "davranış"],
      },
      {
        id: 3,
        title: "Kedi ve Köpeklerde Obezite",
        content: `
        <p>Evcil hayvanlarda fazla kilo sadece dış görünüş meselesi değildir. Hareket isteğini azaltabilir, eklemlere yük bindirebilir, diyabet gibi hastalıkların riskini artırabilir ve yaşam kalitesini düşürebilir. Üstelik çoğu zaman sorun mama kabında değil, alışkanlıklarda başlar.</p>

        <h2>Giriş: Tombik patiler neden bu kadar konuşuluyor?</h2>
        <p>Sosyal medyada göbeği yere yaklaşan kediler, koltukta yuvarlanan köpekler ve “bir lokmadan ne olur” bakışları sık sık karşımıza çıkıyor. İlk bakışta komik, hatta sevimli görünebilirler. Fakat veteriner hekimlik açısından bakıldığında bu görüntünün arkasında oldukça ciddi bir konu vardır: evcil hayvanlarda obezite. Bir kedinin ya da köpeğin fazla kilolu olması, yalnızca fotoğraflarda daha tombul görünmesi anlamına gelmez. Bu durum, hayvanın nefes alışından oyun isteğine, eklem sağlığından metabolizmasına kadar pek çok sistemi etkileyebilir.</p>
        <p>Evcil hayvanların ev içinde insanlarla daha yakın yaşaması, hazır mamalara kolay ulaşılması, ödül mamalarının artması ve hareket alanlarının daralması bu konuyu daha görünür hale getirdi. Eskiden bahçede koşan, avlanan ya da uzun yürüyüşlere çıkan hayvanların yerini bugün çoğu zaman apartmanda yaşayan, günün büyük bölümünü uyuyarak geçiren kedi ve köpekler aldı. Bu değişim tek başına kötü değildir; evcil hayvanlar artık daha güvenli ve konforlu ortamlarda yaşıyor. Ancak konfor arttıkça enerji harcaması azalıyor ve kilo kontrolü daha fazla dikkat istiyor.</p>

        <h2>Obezite nedir, ne zaman “fazla kilo” demeliyiz?</h2>
        <p>Obezite, basitçe vücutta aşırı yağ birikmesi olarak tanımlanabilir. Kedilerde bazı kaynaklar obeziteyi ideal vücut ağırlığının yaklaşık yüzde 20 veya daha fazla üzerine çıkılmasıyla ilişkilendirir. Fakat evde tartıya bakmak her zaman yeterli değildir. Çünkü 5 kilogramlık bir kedi bazı ırklar için normal sayılabilirken, küçük yapılı bir kedi için fazla olabilir. Aynı şekilde 25 kilogramlık bir köpek orta ırkta normal, küçük ırkta ise ciddi fazla kilo anlamına gelebilir.</p>
        <p>Bu nedenle veteriner hekimlikte sadece kilogram değerine değil, vücut kondisyonuna da bakılır. Body Condition Score yani Vücut Kondisyon Skoru, hayvanın kaburgalarının hissedilip hissedilmediğini, bel hattının görülüp görülmediğini ve karın bölgesinde yağ birikimi olup olmadığını değerlendirir. Kısacası tartı bize bir sayı verir; vücut kondisyonu ise o sayının hayvan için ne anlama geldiğini gösterir.</p>

        <h2>Rakamlar ne söylüyor?</h2>
        <p>Bu konu sadece birkaç hayvan sahibinin yaşadığı küçük bir problem değil. Association for Pet Obesity Prevention tarafından yayımlanan 2022 raporunda, ABD’de veteriner profesyoneller tarafından değerlendirilen köpeklerin yüzde 59’unun, kedilerin ise yüzde 61’inin fazla kilolu ya da obez sınıfında olduğu bildirildi. Bu veriler ABD’ye ait olsa da evcil hayvan bakım alışkanlıklarının giderek benzeştiği günümüzde, konunun küresel olarak önem kazandığını gösteriyor.</p>
        <p>2024 yılında yayımlanan geniş kapsamlı bir çalışmada da milyonlarca köpek ve kedi kaydı incelendi. Bulgular, fazla kilo ve obezitenin özellikle erişkin ve olgun yaş dönemlerinde arttığını, hatta büyüme döneminde başlayan kilo probleminin erişkinlikte devam etme eğilimi gösterebildiğini ortaya koydu. Yani “daha yavru, büyüyünce incelir” düşüncesi her zaman güvenli bir yaklaşım değildir. Erken dönemde doğru beslenme alışkanlığı kazanmak, ilerideki kilo yönetimini kolaylaştırabilir.</p>

        <h2>Fazla kilo hayvanı nasıl etkiler?</h2>
        <p>Fazla kilo en önce hareketi etkiler. Hayvan daha çabuk yorulur, oyun oynamak istemez, merdiven çıkarken zorlanabilir ya da yürüyüş sırasında sık sık durabilir. Bu durum hareket azalmasına, hareket azalması da daha fazla kilo almaya yol açar. Böylece kırılması gereken bir döngü oluşur.</p>
        <p>Eklem sağlığı da önemli bir konudur. Fazla ağırlık eklemlere daha çok yük bindirir. Özellikle yaşlı hayvanlarda ya da eklem problemi olan ırklarda bu durum ağrıyı ve hareket kısıtlılığını artırabilir. Kedilerde obezite; osteoartrit, diyabet ve kardiyovasküler yük gibi sorunlarla ilişkilendirilmektedir. Köpeklerde de kilo fazlalığı; eklem hastalıkları, solunum güçlüğü, egzersiz toleransında azalma ve bazı metabolik problemlerin yönetimini zorlaştırabilir.</p>
        <p>Bir de görünmeyen tarafı vardır: yaşam kalitesi. Fazla kilolu bir hayvanın oyun isteği azalabilir, kendini temizlemesi zorlaşabilir, yaz aylarında sıcağa tahammülü düşebilir. Yani mesele yalnızca kaç kilo olduğu değil, o kiloyla nasıl yaşadığıdır.</p>

        <h2>Evde fark etmek için küçük ipuçları</h2>
        <p>Hayvan sahipleri bazen kilo artışını fark etmekte zorlanır, çünkü değişim yavaş olur. Her gün gördüğümüz bir canlının vücudundaki küçük farklılıklar gözden kaçabilir. Bu yüzden birkaç basit kontrol işe yarayabilir. Üstten bakıldığında bel hattı seçilebiliyor mu? Kaburgalar çok bastırmadan hissedilebiliyor mu? Yandan bakıldığında karın hattında hafif bir toparlanma var mı? Tasma ya da göğüs tasması eskisine göre daha mı sıkı geliyor? Hayvan daha az mı hareket ediyor?</p>
        <p>Bu sorular kesin tanı koydurmaz, ama veteriner hekim kontrolü için iyi bir başlangıç sağlar. En doğrusu, düzenli muayenelerde vücut ağırlığının ve kondisyon skorunun takip edilmesidir. Çünkü kilo yönetimi, sorun büyüdükten sonra değil, küçük değişimler başladığında daha kolaydır.</p>

        <h2>“Az yesin geçer” demek neden doğru değil?</h2>
        <p>Kilo sorunu fark edildiğinde ilk akla gelen çözüm çoğu zaman mama miktarını rastgele azaltmaktır. Fakat bu her zaman güvenli değildir. Özellikle kedilerde ani ve ciddi kalori kısıtlaması, karaciğer yağlanması gibi tehlikeli sonuçlara yol açabilir. Ayrıca her mama aynı enerji yoğunluğuna sahip değildir; bir mamanın küçük porsiyonu bile yüksek kalorili olabilir.</p>
        <p>Bu nedenle kilo verme planı veteriner hekimle birlikte yapılmalıdır. Hayvanın yaşı, mevcut hastalıkları, kısırlaştırma durumu, aktivite düzeyi ve kullandığı mama değerlendirilerek gerçekçi bir hedef belirlenir. Bazı hayvanlarda kilo kaybı yavaş ilerler ve bu normaldir. Amaç hızlı zayıflatmak değil, sağlıklı ve sürdürülebilir bir vücut kondisyonuna ulaşmaktır.</p>

        <h2>Daha sağlıklı bir rutin nasıl kurulur?</h2>
        <p>İlk adım ölçmektir. Mama kabını göz kararı doldurmak yerine gramla ölçmek, çoğu zaman büyük fark yaratır. İkinci adım ödül mamalarını görünür hale getirmektir. Gün içinde verilen ödüller, küçük peynir parçaları ya da sofradan uzatılan lokmalar toplam kaloriye dahildir. “Bu sayılmaz” dediğimiz şeyler, vücut tarafından gayet güzel sayılır.</p>
        <p>Kediler için oyun, beslenme kadar önemlidir. Lazer kovalamaca, tüy oltaları, mama bulmaca oyuncakları ve kısa ama sık oyun seansları ev kedilerinin hareketini artırabilir. Köpeklerde ise yürüyüşün süresi kadar kalitesi de önemlidir. Sadece tuvalet için dışarı çıkmak yerine koklama, yavaş tempo yürüyüş ve uygun oyunlar günlük rutine eklenebilir.</p>
        <p>Ayrıca mama kabının sürekli dolu durması yerine öğün düzeni oluşturmak birçok hayvanda işe yarar. Evde birden fazla hayvan varsa her birinin ayrı beslenmesi gerekebilir; çünkü biri diğerinin mamasını bitiriyor olabilir. Kilo yönetimi çoğu zaman büyük yasaklarla değil, küçük düzenlemelerle başlar.</p>

        <h2>İşin eğlenceli tarafı: Diyet değil, “pati projesi”</h2>
        <p>Kilo kontrolü kulağa sıkıcı gelebilir ama bunu ev içinde küçük bir projeye çevirmek mümkün. Haftalık tartı günü yapılabilir, yürüyüş rotaları değiştirilebilir, kediler için ev içinde mini av oyunları hazırlanabilir. Köpeğin mamasının bir kısmı eğitim sırasında ödül olarak kullanılabilir. Böylece hem kalori kontrolü sağlanır hem de hayvan zihinsel olarak uyarılır.</p>
        <p>Burada amaç hayvanı cezalandırmak değildir. Aksine, daha rahat hareket eden, daha kolay nefes alan, oyun oynamaktan keyif alan bir yaşam sunmaktır. Tombik görüntü bize sevimli gelebilir; fakat hayvanın bedeni o fazla yükü her gün taşır.</p>

        <h2>Sonuç</h2>
        <p>Evcil hayvanlarda obezite, modern hayvan sahipliğinin en önemli ama en çok normalleştirilen sorunlarından biridir. Kedi ya da köpeğin fazla kilolu olması, onu daha tatlı yapmaz; çoğu zaman daha yorgun, daha isteksiz ve hastalıklara daha açık hale getirir. Bu yüzden kilo kontrolü estetik bir konu değil, sağlık konusudur.</p>
        <p>En iyi yaklaşım suçlamak değil, fark etmektir. Hayvan sahibi, veteriner hekimle birlikte çalışarak porsiyonları düzenlediğinde, hareketi artırdığında ve düzenli takip yaptığında tablo değişebilir. Küçük bir ölçü kabı, birkaç dakika oyun ve düzenli kontrol, bazen uzun vadede büyük bir sağlık yatırımına dönüşür. Kısacası sevgi her zaman fazla mama vermek değildir; bazen sevgi, mama kabını doğru miktarda doldurup birlikte daha hareketli bir hayat kurmaktır.</p>

        <h3>Mini kontrol listesi</h3>
        <ul>
          <li>Kaburgalar çok bastırmadan hissediliyor mu?</li>
          <li>Üstten bakınca bel hattı seçiliyor mu?</li>
          <li>Ödül mamaları günlük toplam beslenmeye dahil ediliyor mu?</li>
          <li>Mama miktarı gramla ölçülüyor mu?</li>
          <li>Son kontrolde vücut kondisyon skoru konuşuldu mu?</li>
        </ul>
      `,
        image: petVaccination,
        date: "14 Mayıs 2026",
        category: "Sağlık",
        author: "Zeynep Çoban (Veteriner Hekim Öğrencisi)",
        tags: ["obezite", "beslenme", "sağlık"],
      },
      {
        id: 4,
        title: "Görünmez Kalkan: Kedi ve Köpeklerde Aşı Takviminin Hayati Rolü",
        content: `
        <p>Köpeklerde ve kedilerde aşı takvimine sadık kalmak, sadece bireysel bir sağlık tercihi değil, aynı zamanda toplum sağlığını ve hayvan refahını koruyan bilimsel bir gerekliliktir. Bu nedenle aşılar, evcil dostlarımızın görünmez ama güçlü koruyucu kalkanıdır.</p>

        <h2>Bağışıklık Penceresini Doğru Yakalamak</h2>
        <p>Yavru kedi ve köpekler, hayata annelerinden aldıkları kolostrum içindeki antikorlarla başlarlar. Ancak bu koruma geçicidir ve zamanla azalır. Aşı takviminin önemi, bu anne korumasının bittiği ve yavrunun kendi bağışıklığını kurmaya başladığı o hassas bağışıklık penceresini doğru yakalamaktır. Eğer aşılar çok erken yapılırsa anne antikorları aşıyı etkisiz kılar; çok geç kalınırsa yavru savunmasız kalır. Bu nedenle veteriner hekimin belirlediği haftalık periyotlar, bilimsel bir zamanlama hassasiyeti taşır.</p>

        <h2>Doz Tekrarları ve Hatırlatıcılar Neden Gerekli?</h2>
        <p>Birçok kedi ve köpek sahibi, ilk aşılar bittikten sonra sürecin tamamlandığını düşünür. Oysa bağışıklık sistemi, tıpkı öğrenilen bir dil gibi, pratik yapılmadığında unutabilir. İlk doz bağışıklık sistemini tanıştırır. Rapel yani tekrar dozlar, bağışıklık hafızasını güçlendirerek korumanın süresini uzatır. Yıllık tekrarlar ise kuduz, karma veya leukemia gibi aşıların koruyucu antikor seviyesini kanda yüksek tutmak için gereklidir.</p>

        <h2>Kediler İçin Kritik Koruma: Leukemia ve Karma Aşılar</h2>
        <p>Kediler, özellikle de dışarıya erişimi olanlar veya çok kedili ortamlarda yaşayanlar için aşı bir lüks değil, hayatta kalma meselesidir. Kedi karması FVRCP, solunum yolu enfeksiyonlarına ve çok bulaşıcı olan kedi gençlik hastalığına karşı korur. FeLV yani kedi leukemia virüsü ise bağışıklık sistemini çökerten ve tedavisi olmayan bir virüstür; bu virüse karşı yapılan aşı, kedinizin ömrünü yıllarca uzatabilir.</p>

        <h2>Veterinerlikte Sürü Bağışıklığı ve Klinik Güvenlik</h2>
        <p>Köpeklerin sosyal canlılar olması, onları sürekli bir etkileşim içine sokar. Bir köpeğin aşılanması, sadece onu değil; parkta oyun oynadığı arkadaşını, apartman boşluğundan geçen diğer komşu köpeği de korur. Klinik ortamında ise her bireyin aşılı olması, hastalıkların veteriner hastanelerinde yayılma riskini minimize eder. Tıpkı köpeklerin ses tonumuzu ve duygularımızı anlaması aramızdaki bağı güçlendirdiği gibi, bizim de onların sağlık dilini yani aşı takvimini anlamamız bu bağın fiziksel teminatıdır.</p>

        <h2>Sonuç: Bilimle Gelen Uzun Ömür</h2>
        <p>Unutulmamalıdır ki aşılanmış bir kedi veya köpek, sadece hastalıklardan korunmakla kalmaz; vücut direnci yüksek olduğu için yaşlılık dönemindeki diğer dejeneratif hastalıklara karşı da daha dayanıklı olur. Onlar bizim sadece duygusal dünyamızı paylaşan dostlarımız değil, her gün gözlemlediğimiz ve dilini öğrenmeye çalıştığımız sessiz yoldaşlarımızdır. Bu yolda onlara sunabileceğimiz en somut sevgi gösterisi, sağlıklı ve kesintisiz bir yaşamın kapılarını aşıyla aralamaktır.</p>
      `,
        image: petAsı,
        date: "14 Mayıs 2026",
        category: "Sağlık",
        author: "Mehmet Dağlıoğlu(Hayvan Sahibi Dostumuz)",
        tags: ["aşı", "takvim", "sağlık"],
      },
      {
        id: 5,
        title:
          "Bir Kap Sevgi, Bir Ömür Sağlık: Evcil Hayvanlarda Doğru Beslenmenin Bilimi",
        content: `
        <p>Tıpkı köpeklerin bizim duygularımızı okuması ve buna göre tepki vermesi gibi, biz de onların vücut dilini ve ihtiyaçlarını beslenme alışkanlıkları üzerinden okuyabiliriz. Bir köpeğin mama saatini heyecanla beklemesi sadece bir alışkanlık değil, hayatta kalma güdüsü ile sahibine duyduğu güvenin birleşimidir. Peki, bu kaplara koyduğumuz yiyecekler onların uzun ömürlü birer yoldaş olmalarını nasıl sağlar?</p>

        <h2>Mama Seçimi: Sadece Doyurmak mı, Yoksa Beslemek mi?</h2>
        <p>Kedi ve köpeklerin beslenme ihtiyaçları bizlerden oldukça farklıdır. Popüler veterinerlik yaklaşımları, her yaş grubunun ve her yaşam tarzının farklı bir enerji haritası olduğunu vurgular. Protein dengesi, kas yapısının korunması ve doku onarımı için yüksek kaliteli hayvansal proteinlerle kurulmalıdır. Yağ asitleri, parlak tüyler ve sağlıklı bir deri için Omega-3 ve Omega-6 dengesini gerektirir. Probiyotikler ise tıpkı insanlarda olduğu gibi, evcil hayvanlarda da bağışıklık sisteminin büyük bir kısmının bağırsaklarda başladığını hatırlatır.</p>

        <h2>"Mutfaktan Gelen Tehlike" – Ev Yemekleri Neden Riskli?</h2>
        <p>Birçok hayvan sahibi, kendi yediği yemeği paylaşmayı bir sevgi gösterisi olarak görür. Ancak bizim için lezzetli olan bir soğan, sarımsak veya aşırı tuzlu bir gıda dostlarımız için toksik etkiler yaratabilir. Beslenme bilgisi, tıpkı davranış bilgisi gibi veteriner hekimliğin ayrılmaz bir parçasıdır. Profesyonel mamalar, dostlarımızın ihtiyaç duyduğu vitamin ve mineralleri hassas bir dengede sunarak bizi bu risklerden korur.</p>

        <h2>Porsiyon Kontrolü ve Obezite: Sessiz Pandemi</h2>
        <p>Köpeklerin beden dilini doğru okumak, onların her istek dolu bakışında mama vermek demek değildir. Fazla kilo, eklem sağlığından kalp fonksiyonlarına kadar birçok sorunu beraberinde getirir. Mama miktarını onların aktivite düzeyine göre ayarlamak, onlara sunduğumuz en büyük iyiliklerden biridir.</p>

        <h2>Veterinerlik Açısından Neden Önemli?</h2>
        <p>Doğru beslenme, klinik muayenelerde karşılaşılan birçok hastalığın önlenmesinde ilk adımdır. Diyabet, böbrek yetmezliği ve alerjiler gibi sorunların yönetiminde beslenme programı çok değerlidir. Veteriner kliniğinde yapılan bir beslenme danışmanlığı, dostumuzun stres seviyesini düşüren sağlıklı bir yaşamın temelini atar. Düzenli kontroller, beslenme programının köpeğin ve kedinin yaşlanan vücuduna göre güncellenmesini sağlar.</p>

        <h2>Sonuç</h2>
        <p>Köpeklerin bizi dikkatle izlemesi ve rutinlerimize uyum sağlaması, aramızdaki derin bağın bir sonucudur. Onlara sağladığımız dengeli bir diyet, bu bağın fiziksel karşılığıdır. Onlar bizi okumaya devam ederken, biz de onların tabağını bilimle ve özenle doldurarak bu sevgiye en sağlıklı şekilde yanıt verebiliriz.</p>
        `,
        image: catFood,
        date: "14 Mayıs 2026",
        category: "Beslenme",
        author: "Zilan Acar(Hayvan Sahibi Dostumuz)",
        tags: ["beslenme", "sağlık", "obezite"],
      },
    ],
    [],
  );

  useEffect(() => {
    // ID'ye göre blog yazısını bul
    const currentPost = blogPosts.find((post) => post.id === parseInt(id));
    setPost(currentPost);
  }, [id, blogPosts]);

  if (!post) {
    return <div className="loading">Yazı bulunamadı.</div>;
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <div className="blog-detail-info">
          <span className="blog-detail-category">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="blog-detail-meta">
            <span>
              <i className="far fa-calendar"></i> {post.date}
            </span>
            <span>
              <i className="far fa-user"></i> {post.author}
            </span>
          </div>
        </div>
        <div className="blog-detail-image">
          <img src={post.image} alt={post.title} />
        </div>
      </div>

      <div className="blog-detail-content">
        <div className="blog-detail-main">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="blog-detail-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="blog-detail-bottom">
          <div className="blog-detail-author">
            <h3>Yazar Bilgisi</h3>
            <div className="author-info">
              <div className="author-avatar">
                <span>
                  {post.author
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              </div>
              <div className="author-bio">
                <h4>{post.author}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-detail-navigation">
        <Link to="/blog" className="back-to-blog">
          <i className="fas fa-arrow-left"></i> Tüm Yazılara Dön
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
