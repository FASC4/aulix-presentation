<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Estado de la presentación
const currentSlide = ref(0)
const totalSlides = 6 

// Barra de progreso
const progress = computed(() => ((currentSlide.value) / (totalSlides - 1)) * 100)

// Navegación por teclado
const handleKeydown = (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    if (currentSlide.value < totalSlides - 1) currentSlide.value++
  } else if (e.key === 'ArrowLeft') {
    if (currentSlide.value > 0) currentSlide.value--
  }
}

// Datos interactivos extraídos del Manual de Usuario
const activeRole = ref(0)
const roles = [
  { 
    id: 'admin', icon: 'fa-solid fa-chart-pie', title: 'Administrador', color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400',
    desc: 'Visión panorámica de la institución. Toma decisiones basadas en datos reales y al momento.',
    features: ['Auditoría de citas de toda la institución', 'Supervisión de rendimiento e índice de asistencia', 'Cierre definitivo de ciclos escolares', 'Directorio global de usuarios']
  },
  { 
    id: 'coordinacion', icon: 'fa-solid fa-users-gear', title: 'Coordinación', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400',
    desc: 'Centro de mando rápido para administrar la matrícula, grupos y peticiones docentes.',
    features: ['Inscripción masiva a grupos', 'Asignación rápida de materias y docentes', 'Auditoría de trámites y constancias', 'Aprobación de desbloqueo de periodos']
  },
  { 
    id: 'docente', icon: 'fa-solid fa-chalkboard-user', title: 'Docente', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400',
    desc: 'Interfaz limpia para enfocarse en enseñar, reduciendo el papeleo burocrático a cero.',
    features: ['Pase de lista y registro de disciplina', 'Calificación por criterios personalizados', 'Cierre de actas automático', 'Gestión de citas con tutores']
  },
  { 
    id: 'caja', icon: 'fa-solid fa-cash-register', title: 'Caja y Contaduría', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400',
    desc: 'Control financiero de hierro. Cero fugas de capital y visibilidad total de los ingresos.',
    features: ['Cobro de conceptos y punto de venta POS', 'Registro de cortes de caja y egresos', 'Asignación de becas y descuentos', 'Reimpresión y envío de recibos']
  },
  { 
    id: 'tutor', icon: 'fa-solid fa-mobile-screen', title: 'Tutor', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400',
    desc: 'Un solo portal inteligente para ver el desempeño y finanzas de todos sus hijos en la institución.',
    features: ['Boletas y vida académica en tiempo real', 'Solicitud de trámites y citas en línea', 'Estados de cuenta actualizados', 'Consulta de reportes de conducta']
  }
]

// Reducimos el tiempo a 5 segundos
const roleDuration = 5000 
let roleTimer = null

const startRoleTimer = () => {
  stopRoleTimer()
  roleTimer = setInterval(() => {
    activeRole.value = (activeRole.value + 1) % roles.length
  }, roleDuration) 
}

const stopRoleTimer = () => {
  if (roleTimer) {
    clearInterval(roleTimer)
    roleTimer = null
  }
}

const selectRole = (index) => {
  activeRole.value = index
  if (currentSlide.value === 3) startRoleTimer()
}

watch(currentSlide, (newSlide) => {
  if (newSlide === 3) {
    activeRole.value = 0
    startRoleTimer()
  } else {
    stopRoleTimer()
  }

  // Reiniciamos el scroll al inicio en cada cambio de diapositiva (clave en móvil):
  // si el usuario bajó en una slide alta y avanza a una más corta, sin esto
  // el navegador conserva el scrollTop anterior y da la sensación de que
  // "no baja" o se queda topado.
  presentationRef.value?.scrollTo({ top: 0, behavior: 'instant' })
})

const presentationRef = ref(null)
onMounted(() => {
  presentationRef.value?.focus()
  window.addEventListener('keydown', handleKeydown)
  
  // Agregar FontAwesome dinámicamente si no está en el index.html
  if (!document.getElementById('fontawesome')) {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
    script.id = 'fontawesome'
    document.head.appendChild(script)
  }
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopRoleTimer()
})

// --- LÓGICA DEL MODAL DE CONTACTO ---
const showContactModal = ref(false)
const formName = ref('')
const formSchool = ref('')

const sendWhatsApp = () => {
  if (!formName.value || !formSchool.value) return;
  
  // Construimos el mensaje predeterminado
  const message = `Hola, mi nombre es ${formName.value} del colegio ${formSchool.value}. Me gustaría recibir más información sobre AuLix y agendar una demostración.`;
  
  // Codificamos el texto para que sea seguro en la URL
  const url = `https://wa.me/522215699676?text=${encodeURIComponent(message)}`;
  
  // Abrimos WhatsApp Web/App en una nueva pestaña
  window.open(url, '_blank');
  
  // Limpiamos el formulario y cerramos el modal
  formName.value = '';
  formSchool.value = '';
  showContactModal.value = false;
}

// Función para avanzar a la siguiente diapositiva
// const nextSlide = () => {
//   if (currentSlide.value < totalSlides - 1) {
//     currentSlide.value++
//   }
// }

// Funciones de navegación
const nextSlide = () => {
  if (currentSlide.value < totalSlides - 1) currentSlide.value++
}

const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}
</script>

<template>
  <main 
    ref="presentationRef"
    class="h-[100dvh] md:h-screen w-full max-w-[100vw] bg-[#040B16] text-white font-sans outline-none flex flex-col relative overflow-x-hidden overflow-y-auto md:overflow-hidden"
    tabindex="0"
    style="background-image: radial-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), radial-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; background-position: 0 0, 20px 20px;"
  >
    <!-- Background Decorators -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[rgba(0,229,255,0.15)] blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[rgba(59,130,246,0.15)] blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Barra de progreso superior -->
    <div class="absolute top-0 left-0 h-1 bg-blue-950 w-full z-50">
      <div 
        class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <!-- Contenedor de Diapositivas -->
    <div class="flex-1 relative z-10 w-full max-w-6xl mx-auto flex items-start md:items-center justify-center p-4 sm:p-6 md:p-12 pb-36 md:pb-16 min-h-0 overflow-x-hidden overflow-y-visible">
      <Transition name="slide" mode="out-in">
        
        <!-- SLIDE 0: Portada -->
        <div v-if="currentSlide === 0" class="text-center w-full flex flex-col items-center justify-center" :key="0">
          <div class="mb-8 w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            <i class="fa-solid fa-graduation-cap text-5xl text-white"></i>
          </div>
          
          <h1 class="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl">AULIX</h1>
          
          <h2 class="text-2xl md:text-4xl text-blue-200 font-light mb-12 max-w-3xl">
            Gestiona tu colegio sin perder la cabeza.
          </h2>
          
          <!-- <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-900/40 border border-blue-500/50 text-sm font-bold text-cyan-400 animate-pulse">
            Presiona <kbd class="px-2 py-1 bg-blue-950 rounded border border-blue-800 text-cyan-300">Espacio</kbd> o <kbd class="px-2 py-1 bg-blue-950 rounded border border-blue-800 text-cyan-300"><i class="fa-solid fa-arrow-right"></i></kbd> para iniciar
          </div> -->
        </div>

        <!-- SLIDE 1: El Problema -->
        <div v-else-if="currentSlide === 1" class="w-full" :key="1">
          <div class="text-center md:text-left mb-12">
            <span class="text-rose-400 text-sm font-bold tracking-widest uppercase mb-2 block"><i class="fa-solid fa-triangle-exclamation mr-2"></i>La Realidad Administrativa</span>
            <h2 class="text-4xl md:text-5xl font-black text-white">¿Por qué duele gestionar un colegio?</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-8 bg-[rgba(13,27,50,0.6)] border border-rose-500/30 rounded-3xl relative overflow-hidden backdrop-blur-md transition-transform hover:scale-105">
              <div class="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
              <div class="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6 border border-rose-500/30">
                <i class="fa-solid fa-folder-tree text-2xl text-rose-400"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Papeleo Infinito</h3>
              <p class="text-sm text-blue-200/70 leading-relaxed">Expedientes regados, actas que no cuadran y días enteros perdidos cruzando datos en Excel para cerrar el periodo.</p>
            </div>

            <div class="p-8 bg-[rgba(13,27,50,0.6)] border border-rose-500/30 rounded-3xl relative overflow-hidden backdrop-blur-md transition-transform hover:scale-105">
              <div class="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
              <div class="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6 border border-rose-500/30">
                <i class="fa-solid fa-wallet text-2xl text-rose-400"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Fugas Financieras</h3>
              <p class="text-sm text-blue-200/70 leading-relaxed">Cobros manuales que generan cuellos de botella en caja y falta de visibilidad en los adeudos reales de los alumnos.</p>
            </div>

            <div class="p-8 bg-[rgba(13,27,50,0.6)] border border-rose-500/30 rounded-3xl relative overflow-hidden backdrop-blur-md transition-transform hover:scale-105">
              <div class="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
              <div class="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6 border border-rose-500/30">
                <i class="fa-solid fa-users-slash text-2xl text-rose-400"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Familias Desconectadas</h3>
              <p class="text-sm text-blue-200/70 leading-relaxed">Tutores que exigen respuestas a coordinación por no tener acceso directo al desempeño y faltas de sus hijos.</p>
            </div>
          </div>
        </div>

        <!-- SLIDE 2: La Bóveda -->
        <div v-else-if="currentSlide === 2" class="w-full text-center flex flex-col items-center justify-center" :key="2">
          <span class="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold border border-cyan-500/40 tracking-wide uppercase mb-6 block w-max mx-auto">El Ecosistema Aulix</span>
          <h2 class="text-5xl md:text-6xl font-black text-white mb-6">Tu Propia <span class="text-cyan-400">Bóveda Digital</span></h2>
          <p class="text-xl text-blue-200 max-w-3xl mb-16 mx-auto">Orquestamos la seguridad aislando tu base de datos. No te rentamos una habitación, te entregamos las llaves de tu propio edificio blindado.</p>
          
          <div class="w-full max-w-3xl bg-[rgba(13,27,50,0.6)] border border-blue-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between backdrop-blur-xl shadow-2xl">
            <div class="text-center p-4">
              <i class="fa-solid fa-shield-halved text-6xl text-blue-500 mb-4 drop-shadow-lg"></i>
              <p class="text-lg font-bold text-white">Motor AuLix</p>
            </div>
            
            <div class="flex-1 w-full px-8 relative py-8 md:py-0">
              <div class="w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative overflow-hidden">
                <div class="absolute top-0 left-0 h-full w-1/3 bg-white/40 blur-sm animate-[slide_2s_ease-in-out_infinite]"></div>
              </div>
              <i class="fa-solid fa-chevron-right absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-cyan-400 animate-pulse hidden md:block"></i>
            </div>
            
            <div class="text-center bg-blue-900/50 p-6 rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <i class="fa-solid fa-building-columns text-5xl text-cyan-400 mb-3"></i>
              <p class="text-lg font-bold text-white">Tu Colegio</p>
              <p class="text-xs text-cyan-300 uppercase tracking-widest mt-2 font-bold">100% Aislado</p>
            </div>
          </div>
        </div>

        <!-- SLIDE 3: Roles Interactivos (Optimizada para Móvil) -->
        <div v-else-if="currentSlide === 3" class="w-full flex flex-col justify-center my-auto" :key="3">
          <div class="text-center mb-6">
            <span class="text-cyan-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 block"><i class="fa-solid fa-bolt mr-2"></i>Experiencia a la Medida</span>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white">Un espacio para cada perfil.</h2>
          </div>

          <!-- Contenedor adaptativo: en móvil apila verticalmente o usa scroll horizontal fino -->
          <div class="grid md:grid-cols-12 gap-4 md:gap-6 items-start w-full">
            
            <!-- Menú de Selección (En móvil es una barra horizontal fluida, en escritorio menú lateral) -->
            <div class="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 custom-scrollbar w-full flex-nowrap md:flex-wrap">
              <button 
                v-for="(role, index) in roles" :key="role.id"
                @click="selectRole(index)"
                class="relative flex-shrink-0 md:flex-shrink flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all duration-300 border text-left bg-blue-950/40 backdrop-blur-sm overflow-hidden min-w-[160px] md:min-w-0"
                :class="activeRole === index ? `bg-blue-900/80 border-cyan-400/60 shadow-lg` : 'border-blue-800/40 hover:bg-blue-900/40'"
              >
                <!-- Barra de progreso (Cronómetro) -->
                <div v-if="activeRole === index" class="absolute bottom-0 left-0 h-1 bg-cyan-400 progress-bar"></div>

                <div class="w-9 h-9 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-base md:text-xl transition-all duration-300 shadow-inner border flex-shrink-0"
                     :class="activeRole === index ? `bg-gradient-to-br ${role.color} border-white/20 text-white` : 'bg-blue-950 border-blue-800 text-blue-400/60'">
                  <i :class="role.icon"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-xs md:text-base truncate" :class="activeRole === index ? 'text-white' : 'text-blue-200/60'">{{ role.title }}</h4>
                </div>
              </button>
            </div>

            <!-- Contenido de la Pantalla (Sin altura fija para que NUNCA se corte) -->
            <div class="md:col-span-8 bg-[#0A1526] border border-blue-900/50 rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden w-full">
              
              <!-- Barra superior tipo navegador -->
              <div class="bg-[#0D1B2A] px-4 py-2.5 flex items-center border-b border-blue-900/50">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div class="flex-1 text-center text-[10px] md:text-xs font-mono text-blue-300/50 truncate">app.aulix.mx/{{ roles[activeRole].id }}</div>
              </div>

              <!-- Ventana principal del perfil -->
              <div class="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay">
                <Transition name="fade" mode="out-in">
                  <div :key="activeRole" class="w-full">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl border border-white/10 shadow-lg flex-shrink-0" :class="[roles[activeRole].bg, roles[activeRole].text]">
                        <span class="text-2xl md:text-3xl"><i :class="roles[activeRole].icon"></i></span>
                      </div>
                      <div>
                        <h3 class="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">{{ roles[activeRole].title }}</h3>
                        <p class="text-xs sm:text-sm text-blue-200/90 leading-snug">{{ roles[activeRole].desc }}</p>
                      </div>
                    </div>
                    
                    <hr class="border-blue-900/50 my-4" />
                    
                    <!-- Cuadrícula de Ventajas / Características -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                      <div v-for="(feat, idx) in roles[activeRole].features" :key="idx" 
                           class="flex items-start gap-2.5 p-2.5 md:p-3 rounded-lg bg-blue-950/40 border border-blue-900/30">
                        <i class="fa-solid fa-check text-xs md:text-sm mt-0.5 flex-shrink-0" :class="roles[activeRole].text"></i>
                        <span class="text-blue-100 text-xs sm:text-sm font-medium leading-normal">{{ feat }}</span>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

            </div>

          </div>
        </div>

        <!-- SLIDE 4: Comunicación y Control Total (Nueva) -->
        <div v-else-if="currentSlide === 4" class="w-full text-center flex flex-col justify-center items-center" :key="4">
          <span class="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-2 block"><i class="fa-solid fa-tower-cell mr-2"></i>Ecosistema Integrado</span>
          <h2 class="text-4xl md:text-5xl font-black mb-6 text-white">Información centralizada. <br><span class="text-emerald-400">Comunidad conectada.</span></h2>
          <p class="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">Desde la gestión documental hasta la difusión de noticias, AuLix automatiza las tareas administrativas que roban el tiempo de tu equipo.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            <div class="p-6 bg-[rgba(13,27,50,0.6)] border border-emerald-500/30 rounded-2xl text-left backdrop-blur-md">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-4 border border-emerald-500/30">
                <i class="fa-solid fa-chart-column"></i>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">Centro de Reportes</h3>
              <p class="text-sm text-blue-200/80 leading-relaxed">Analiza el rendimiento. Descarga reportes académicos y listas oficiales por lotes en PDF o Excel en cuestión de segundos.</p>
            </div>

            <div class="p-6 bg-[rgba(13,27,50,0.6)] border border-cyan-500/30 rounded-2xl text-left backdrop-blur-md">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl mb-4 border border-cyan-500/30">
                <i class="fa-solid fa-bullhorn"></i>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">Avisos Globales</h3>
              <p class="text-sm text-blue-200/80 leading-relaxed">Gestión completa de la comunicación a gran escala. Dirige comunicados con fecha de expiración a docentes, tutores o personal de manera precisa.</p>
            </div>

            <div class="p-6 bg-[rgba(13,27,50,0.6)] border border-blue-500/30 rounded-2xl text-left backdrop-blur-md">
              <div class="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-4 border border-blue-500/30">
                <i class="fa-solid fa-folder-open"></i>
              </div>
              <h3 class="text-lg font-bold text-white mb-2">Expediente Digital</h3>
              <p class="text-sm text-blue-200/80 leading-relaxed">Adiós a las carpetas físicas. Almacena en la nube y visualiza el acta de nacimiento, CURP y la foto oficial de cada estudiante en un solo lugar.</p>
            </div>

          </div>
        </div>

        <!-- SLIDE 5: Cierre -->
        <div v-else-if="currentSlide === 5" class="w-full flex flex-col items-center justify-center text-center" :key="5">
          <div class="relative z-10">
            <i class="fa-solid fa-rocket text-6xl text-cyan-400 mb-8 drop-shadow-[0_0_30px_rgba(0,229,255,0.6)] animate-bounce"></i>
            <h2 class="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight">Es hora de evolucionar.</h2>
            <p class="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">Deja de apagar incendios diarios y toma el control real de tu institución. Atención personalizada y soporte constante.</p>
            
            <a @click="showContactModal = true" class="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-full text-xl transition-all hover:bg-blue-500 hover:scale-105 shadow-[0_0_40px_rgba(37,99,235,0.5)]">
              Contáctanos <i class="fa-solid fa-paper-plane"></i>
            </a>
          </div>
        </div>

      </Transition>
    </div>
    
    <!-- Controles Flotantes de Navegación (Flecha Izquierda / Flecha Derecha) -->
    <div class="fixed md:absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-blue-950/80 border border-blue-500/40 backdrop-blur-md p-1.5 rounded-full shadow-[0_0_25px_rgba(0,229,255,0.25)] select-none">
      
      <!-- Botón Anterior -->
      <button 
        v-if="currentSlide > 0"
        @click="prevSlide"
        class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-cyan-300 hover:text-white hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
        title="Diapositiva Anterior"
      >
        <i class="fa-solid fa-arrow-left text-sm md:text-base"></i>
      </button>

      <!-- Indicador o Atajo de Teclado (Visible solo si se puede avanzar) -->
      <span v-if="currentSlide < totalSlides - 1" class="text-xs text-cyan-300/80 font-bold px-2 hidden sm:inline-block">
        Navega con las flechas o <kbd class="px-1.5 py-0.5 bg-blue-900 rounded border border-blue-700 text-white font-mono text-[10px]">Espacio</kbd>
      </span>

      <!-- Botón Siguiente -->
      <button 
        v-if="currentSlide < totalSlides - 1"
        @click="nextSlide"
        class="px-4 h-10 md:h-12 rounded-full bg-blue-600 hover:bg-blue-500 border border-cyan-400/50 flex items-center gap-2 text-white font-bold text-xs md:text-sm shadow-[0_0_15px_rgba(37,99,235,0.5)] active:scale-95 transition-all cursor-pointer"
        title="Siguiente Diapositiva"
      >
        <span>Siguiente</span>
        <i class="fa-solid fa-arrow-right text-sm"></i>
      </button>
    </div>

    <!-- Contador de Slides -->
    <div class="fixed md:absolute bottom-6 right-6 text-blue-500/60 font-mono text-xs md:text-sm z-50 font-bold select-none bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-900/50 backdrop-blur-sm">
      {{ currentSlide + 1 }} / {{ totalSlides }}
    </div>

    <!-- Modal de Contacto (WhatsApp) -->
    <Transition name="fade">
      <div v-if="showContactModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-[#0A1526] border border-blue-500/30 rounded-3xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
          
          <!-- Botón de Cerrar -->
          <button @click="showContactModal = false" class="absolute top-5 right-5 text-blue-400 hover:text-white transition-colors">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
          
          <!-- Encabezado del Modal -->
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/30">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <h3 class="text-2xl font-black text-white">Agenda tu Demo</h3>
            <p class="text-sm text-blue-200 mt-2">Déjanos tus datos y te enviaremos la información directamente a WhatsApp.</p>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="sendWhatsApp" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-blue-300 uppercase tracking-wide mb-1">Tu Nombre</label>
              <input 
                v-model="formName" 
                type="text" 
                required 
                class="w-full bg-[#040B16] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" 
                placeholder="Ej. Armando"
              >
            </div>
            <div>
              <label class="block text-xs font-bold text-blue-300 uppercase tracking-wide mb-1">Tu Colegio</label>
              <input 
                v-model="formSchool" 
                type="text" 
                required 
                class="w-full bg-[#040B16] border border-blue-900/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" 
                placeholder="Nombre de la institución"
              >
            </div>
            
            <button type="submit" class="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Abrir chat seguro <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>

          <!-- Mensaje de Respaldo -->
          <div class="mt-6 text-center border-t border-blue-900/50 pt-5">
            <p class="text-xs text-blue-300/70 leading-relaxed">
              ¿No tienes WhatsApp abierto en este momento?<br>
              Guarda nuestro número y escríbenos después:<br>
              <span class="font-mono text-cyan-400 font-bold text-sm mt-1 block tracking-wider">+52 221 569 9676</span>
            </p>
          </div>

        </div>
      </div>
    </Transition>
  </main>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from { opacity: 0; transform: translateY(30px) scale(0.98); }
.slide-leave-to { opacity: 0; transform: translateY(-30px) scale(0.98); }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from { opacity: 0; transform: translateX(10px); }
.fade-leave-to { opacity: 0; transform: translateX(-10px); }

@keyframes slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}

/* Bloquear scroll nativo del body para evitar conflictos y efecto "rebote" */
html, body {
  overflow: hidden !important; 
  width: 100%;
  height: 100%;
  max-width: 100vw;
  scroll-behavior: smooth;
  margin: 0;
  padding: 0;
}

/* Aseguramos que <main> maneje su propio scroll de forma fluida */
main {
  -webkit-overflow-scrolling: touch;
}

/* Scrollbar discreta para el menú de roles */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(13, 27, 50, 0.3);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.4);
  border-radius: 10px;
}

.progress-bar {
  animation: fillUp 5s linear forwards;
}

@keyframes fillUp {
  0% { width: 0%; }
  100% { width: 100%; }
}
</style>