(function(){
const C=window.SITE_CONFIG||{};const $=s=>document.querySelector(s);
const btn=$('.menu-btn'),nav=$('#navlinks');
btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded',false)}));
if(C.TEACHER_EMAIL){$('#teacher-email').innerHTML=`<a href="mailto:${C.TEACHER_EMAIL}">${C.TEACHER_EMAIL}</a>`}
if(C.BLAST_SYSTEM_NAME)document.querySelectorAll('.blast-name').forEach(e=>e.textContent=C.BLAST_SYSTEM_NAME);
function enable(el,url,label){if(!url)return;el.href=url;el.target='_blank';el.rel='noopener';el.removeAttribute('aria-disabled');el.textContent=label}
enable($('#classroom-btn'),C.CLASSROOM_URL,'Open Google Classroom');
enable($('#volunteer-btn'),C.VOLUNTEER_URL,'Sign up to volunteer');
document.querySelectorAll('.btn[aria-disabled=true]').forEach(b=>b.addEventListener('click',e=>e.preventDefault()));
function frame(src,title){const f=document.createElement('iframe');f.src=src;f.title=title;f.className='embed';f.loading='lazy';return f}
if(C.CALENDAR_EMBED_URL){$('#cal-embed').appendChild(frame(C.CALENDAR_EMBED_URL,'Class calendar'));$('#cal-list').hidden=true}
if(C.VOLUNTEER_URL&&C.VOLUNTEER_EMBED)$('#volunteer-embed').appendChild(frame(C.VOLUNTEER_URL,'Volunteer sign-up'));
// Contact form
const form=$('#contact-form'),status=$('#form-status');
const live=C.WEB3FORMS_KEY&&C.WEB3FORMS_KEY!=='REPLACE_ME';
if(!live)$('#form-notice').hidden=false;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const fields={email:['#f-email','#e-email'],subject:['#f-subject','#e-subject'],message:['#f-message','#e-message']};
function check(k){const[i,e]=fields[k];const el=$(i),v=el.value.trim();let m='';
 if(!v)m={email:'Please enter your email address.',subject:'Please add a subject.',message:'Please write a message.'}[k];
 else if(k==='email'&&!EMAIL.test(v))m='That email doesn\u2019t look right (example: name@example.com).';
 $(e).textContent=m;el.classList.toggle('invalid',!!m);el.setAttribute('aria-invalid',!!m);return!m}
Object.keys(fields).forEach(k=>$(fields[k][0]).addEventListener('blur',()=>check(k)));
form.addEventListener('submit',async ev=>{ev.preventDefault();delete form.dataset.result;status.className='status';status.textContent='';
 const ok=Object.keys(fields).map(check).every(Boolean);
 if(!ok){form.querySelector('.invalid').focus();form.dataset.result='invalid';return}
 if(form.botcheck.checked)return;
 if(!live){status.textContent='The form isn\u2019t connected yet. Please email me directly. Thank you!';status.classList.add('bad');form.dataset.result='notconfigured';return}
 const b=form.querySelector('button');b.disabled=true;b.textContent='Sending\u2026';
 try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
  body:JSON.stringify({access_key:C.WEB3FORMS_KEY,email:$('#f-email').value.trim(),subject:$('#f-subject').value.trim(),message:$('#f-message').value.trim(),from_name:'Ms. Missan class site',botcheck:false})});
  const j=await r.json();if(!r.ok||!j.success)throw new Error(j.message||'failed');
  form.reset();status.textContent='Thanks! Your message was sent. I\u2019ll get back to you soon.';status.classList.add('ok');form.dataset.result='sent';
 }catch(e){status.textContent='Sorry, something went wrong. Please try again or email me directly.';status.classList.add('bad');form.dataset.result='error'}
 finally{b.disabled=false;b.textContent='Send message'}});
})();

// Hide the Classroom section and its nav link until a class link exists
if(!(window.SITE_CONFIG||{}).CLASSROOM_URL){document.getElementById('classroom')?.remove();document.querySelector('a[href="#classroom"]')?.remove();}
