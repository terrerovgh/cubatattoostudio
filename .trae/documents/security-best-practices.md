# 🔒 Guía de Seguridad y Mejores Prácticas

## Cuba Tattoo Studio - Security Guidelines

---

## 📋 Índice

1. [Seguridad Frontend](#-seguridad-frontend)
2. [Protección de Formularios](#-protección-de-formularios)
3. [Gestión de APIs y Tokens](#-gestión-de-apis-y-tokens)
4. [Seguridad de Contenido](#-seguridad-de-contenido)
5. [Headers de Seguridad](#-headers-de-seguridad)
6. [Validación y Sanitización](#-validación-y-sanitización)
7. [Monitoreo y Logging](#-monitoreo-y-logging)
8. [Backup y Recovery](#-backup-y-recovery)
9. [Checklist de Seguridad](#-checklist-de-seguridad)

---

## 🛡️ Seguridad Frontend

### Content Security Policy (CSP)

```html
<!-- En Layout.astro -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://api.emailjs.com https://www.google-analytics.com;
  frame-src 'self' https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
">
```

### Configuración de Headers de Seguridad

```javascript
// En astro.config.mjs o netlify.toml
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};
```

### Protección contra XSS

```javascript
// Función de sanitización para contenido dinámico
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Validación de inputs
function validateInput(input, type) {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
    text: /^[\w\s\.,!?\-]{1,500}$/
  };
  
  return patterns[type] ? patterns[type].test(input) : false;
}
```

---

## 📝 Protección de Formularios

### Rate Limiting

```javascript
// Implementación de rate limiting en el cliente
class RateLimiter {
  constructor(maxAttempts = 3, timeWindow = 300000) { // 5 minutos
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
    this.attempts = new Map();
  }
  
  canSubmit(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Limpiar intentos antiguos
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }
}

// Uso en formulario de reservas
const rateLimiter = new RateLimiter(3, 300000);

function handleFormSubmit(event) {
  const userIP = getUserIP(); // Implementar según necesidad
  
  if (!rateLimiter.canSubmit(userIP)) {
    event.preventDefault();
    showError('Demasiados intentos. Espera 5 minutos antes de intentar nuevamente.');
    return;
  }
  
  // Proceder con el envío
}
```

### Validación de Formularios

```javascript
// Validación completa del formulario de reservas
class FormValidator {
  constructor() {
    this.rules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
        message: 'Nombre debe contener solo letras y espacios (2-50 caracteres)'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email debe tener un formato válido'
      },
      phone: {
        required: true,
        pattern: /^[\+]?[1-9][\d]{9,14}$/,
        message: 'Teléfono debe tener entre 10-15 dígitos'
      },
      description: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: 'Descripción debe tener entre 10-1000 caracteres'
      },
      size: {
        required: true,
        options: ['pequeño', 'mediano', 'grande', 'extra-grande'],
        message: 'Selecciona un tamaño válido'
      },
      location: {
        required: true,
        minLength: 3,
        maxLength: 100,
        message: 'Ubicación debe tener entre 3-100 caracteres'
      }
    };
  }
  
  validate(formData) {
    const errors = {};
    
    for (const [field, value] of Object.entries(formData)) {
      const rule = this.rules[field];
      if (!rule) continue;
      
      // Requerido
      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = `${field} es requerido`;
        continue;
      }
      
      if (value) {
        // Longitud mínima
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = rule.message;
          continue;
        }
        
        // Longitud máxima
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = rule.message;
          continue;
        }
        
        // Patrón
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = rule.message;
          continue;
        }
        
        // Opciones válidas
        if (rule.options && !rule.options.includes(value)) {
          errors[field] = rule.message;
          continue;
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
```

### Protección CSRF

```javascript
// Generación de token CSRF
function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Almacenar token en sessionStorage
function setCSRFToken() {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
}

// Validar token en formularios
function validateCSRFToken(submittedToken) {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken && storedToken === submittedToken;
}
```

---

## 🔑 Gestión de APIs y Tokens

### Variables de Entorno Seguras

```bash
# .env.example - Plantilla pública
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_SITE_NAME="Cuba Tattoo Studio"

# APIs públicas (solo claves públicas)
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Información de contacto
PUBLIC_STUDIO_PHONE="(505) 123-4567"
PUBLIC_STUDIO_EMAIL="info@cubatattoostudio.com"
```

```bash
# .env.production - Archivo privado (NUNCA commitear)
PUBLIC_SITE_URL=https://cubatattoostudio.com

# EmailJS - Solo clave pública es segura en frontend
PUBLIC_EMAILJS_SERVICE_ID=service_real_id
PUBLIC_EMAILJS_TEMPLATE_ID=template_real_id
PUBLIC_EMAILJS_PUBLIC_KEY=real_public_key

# Google Maps - Restringir por dominio
PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyReal_API_Key_Here

# Analytics
PUBLIC_GA_TRACKING_ID=G-REALTRACKINGID
```

### Configuración Segura de APIs

```javascript
// Configuración de EmailJS con validación
class SecureEmailJS {
  constructor() {
    this.serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    this.templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    this.publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
    
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      throw new Error('EmailJS configuration missing');
    }
  }
  
  async sendEmail(formData) {
    try {
      // Validar datos antes de enviar
      const validator = new FormValidator();
      const validation = validator.validate(formData);
      
      if (!validation.isValid) {
        throw new Error('Datos de formulario inválidos');
      }
      
      // Sanitizar datos
      const sanitizedData = this.sanitizeFormData(formData);
      
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        sanitizedData,
        this.publicKey
      );
      
      return { success: true, response };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }
  
  sanitizeFormData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim().substring(0, 1000); // Limitar longitud
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
```

---

## 🖼️ Seguridad de Contenido

### Validación de Uploads de Imágenes

```javascript
// Validación de archivos de imagen
class ImageValidator {
  constructor() {
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    this.maxSize = 5 * 1024 * 1024; // 5MB
    this.maxDimensions = { width: 2048, height: 2048 };
  }
  
  async validateFile(file) {
    const errors = [];
    
    // Validar tipo
    if (!this.allowedTypes.includes(file.type)) {
      errors.push('Tipo de archivo no permitido. Solo JPG, PNG y WebP.');
    }
    
    // Validar tamaño
    if (file.size > this.maxSize) {
      errors.push('Archivo demasiado grande. Máximo 5MB.');
    }
    
    // Validar dimensiones
    try {
      const dimensions = await this.getImageDimensions(file);
      if (dimensions.width > this.maxDimensions.width || 
          dimensions.height > this.maxDimensions.height) {
        errors.push(`Dimensiones demasiado grandes. Máximo ${this.maxDimensions.width}x${this.maxDimensions.height}px.`);
      }
    } catch (error) {
      errors.push('Error al procesar la imagen.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
```

### Protección de Imágenes

```javascript
// Watermark automático para imágenes del portfolio
class ImageProtection {
  static addWatermark(canvas, text = '© Cuba Tattoo Studio') {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Configurar watermark
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${Math.max(width * 0.03, 16)}px Arial`;
    ctx.textAlign = 'center';
    
    // Posicionar en esquina inferior derecha
    const x = width - (width * 0.15);
    const y = height - (height * 0.05);
    
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1.0;
  }
  
  static preventRightClick() {
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'IMG' && e.target.classList.contains('portfolio-image')) {
        e.preventDefault();
      }
    });
    
    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG' && e.target.classList.contains('portfolio-image')) {
        e.preventDefault();
      }
    });
  }
}
```

---

## 🔒 Headers de Seguridad

### Configuración Netlify

```toml
# netlify.toml - Headers de seguridad
[[headers]]
  for = "/*"
  [headers.values]
    # Prevenir clickjacking
    X-Frame-Options = "DENY"
    
    # Prevenir MIME type sniffing
    X-Content-Type-Options = "nosniff"
    
    # Activar filtro XSS del navegador
    X-XSS-Protection = "1; mode=block"
    
    # Controlar referrer
    Referrer-Policy = "strict-origin-when-cross-origin"
    
    # Limitar permisos
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=()"
    
    # HSTS
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    
    # CSP
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com;"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    # Prevenir hotlinking
    X-Robots-Tag = "noindex"
```

### Configuración Vercel

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        }
      ]
    }
  ]
}
```

---

## ✅ Validación y Sanitización

### Biblioteca de Validación

```javascript
// utils/validation.js
export class SecurityValidator {
  static sanitizeString(str, maxLength = 1000) {
    if (typeof str !== 'string') return '';
    
    return str
      .trim()
      .substring(0, maxLength)
      .replace(/[<>"'&]/g, (match) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match];
      });
  }
  
  static validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email) && email.length <= 254;
  }
  
  static validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
  
  static validateURL(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
  
  static detectSQLInjection(input) {
    const sqlPatterns = [
      /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
      /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  static detectXSS(input) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
}
```

---

## 📊 Monitoreo y Logging

### Sistema de Logging de Seguridad

```javascript
// utils/security-logger.js
class SecurityLogger {
  constructor() {
    this.endpoint = '/api/security-log'; // Si tuviéramos backend
    this.localLogs = [];
  }
  
  logSecurityEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: event.type,
      severity: event.severity || 'medium',
      details: event.details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ip: this.getClientIP() // Implementar según necesidad
    };
    
    // Log local
    this.localLogs.push(logEntry);
    
    // Mantener solo los últimos 100 logs
    if (this.localLogs.length > 100) {
      this.localLogs.shift();
    }
    
    // Log crítico - enviar inmediatamente
    if (event.severity === 'high') {
      this.sendCriticalAlert(logEntry);
    }
    
    console.warn('Security Event:', logEntry);
  }
  
  logFormSubmission(formType, success, errors = []) {
    this.logSecurityEvent({
      type: 'form_submission',
      severity: success ? 'low' : 'medium',
      details: {
        formType,
        success,
        errors: errors.length,
        errorTypes: errors.map(e => e.type)
      }
    });
  }
  
  logSuspiciousActivity(activity) {
    this.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'high',
      details: activity
    });
  }
  
  sendCriticalAlert(logEntry) {
    // En un escenario real, enviaríamos a un servicio de monitoreo
    console.error('CRITICAL SECURITY EVENT:', logEntry);
    
    // Ejemplo: enviar a servicio externo
    if (typeof gtag !== 'undefined') {
      gtag('event', 'security_alert', {
        event_category: 'Security',
        event_label: logEntry.type,
        value: 1
      });
    }
  }
}

// Instancia global
const securityLogger = new SecurityLogger();
export default securityLogger;
```

### Monitoreo de Intentos de Ataque

```javascript
// Detectar y registrar intentos de ataque
class AttackDetector {
  constructor() {
    this.suspiciousPatterns = [
      /\.\.\//g, // Directory traversal
      /<script/gi, // XSS
      /union.*select/gi, // SQL injection
      /javascript:/gi, // JavaScript injection
      /data:text\/html/gi // Data URI XSS
    ];
    
    this.init();
  }
  
  init() {
    // Monitorear inputs
    document.addEventListener('input', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        this.checkInput(e.target.value, e.target.name);
      }
    });
    
    // Monitorear URLs
    this.checkURL(window.location.href);
  }
  
  checkInput(value, fieldName) {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(value)) {
        securityLogger.logSuspiciousActivity({
          type: 'malicious_input',
          field: fieldName,
          pattern: pattern.toString(),
          value: value.substring(0, 100) // Solo primeros 100 chars
        });
        break;
      }
    }
  }
  
  checkURL(url) {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(url)) {
        securityLogger.logSuspiciousActivity({
          type: 'malicious_url',
          url,
          pattern: pattern.toString()
        });
        break;
      }
    }
  }
}

// Inicializar detector
new AttackDetector();
```

---

## 💾 Backup y Recovery

### Estrategia de Backup

```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/security_backup_$DATE"
S3_BUCKET="cuba-tattoo-backups" # Si usáramos S3

# Crear directorio de backup
mkdir -p $BACKUP_DIR

echo "🔄 Iniciando backup de seguridad..."

# Backup de configuración
cp astro.config.mjs $BACKUP_DIR/
cp tailwind.config.js $BACKUP_DIR/
cp package.json $BACKUP_DIR/
cp netlify.toml $BACKUP_DIR/ 2>/dev/null || true
cp vercel.json $BACKUP_DIR/ 2>/dev/null || true

# Backup de datos críticos
cp -r src/data/ $BACKUP_DIR/ 2>/dev/null || true

# Backup de imágenes (solo metadatos, no archivos grandes)
find public/images -name "*.jpg" -o -name "*.png" -o -name "*.webp" | head -10 > $BACKUP_DIR/image_list.txt

# Backup de variables de entorno (sin valores sensibles)
grep "^PUBLIC_" .env.example > $BACKUP_DIR/env_template.txt 2>/dev/null || true

# Crear hash de integridad
find $BACKUP_DIR -type f -exec sha256sum {} \; > $BACKUP_DIR/integrity.sha256

# Comprimir backup
tar -czf "security_backup_$DATE.tar.gz" $BACKUP_DIR

# Limpiar directorio temporal
rm -rf $BACKUP_DIR

echo "✅ Backup completado: security_backup_$DATE.tar.gz"

# Limpiar backups antiguos (mantener solo los últimos 7)
ls -t security_backup_*.tar.gz | tail -n +8 | xargs rm -f 2>/dev/null || true

echo "🧹 Backups antiguos limpiados"
```

### Verificación de Integridad

```bash
#!/bin/bash
# scripts/verify-integrity.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Uso: $0 <archivo_backup.tar.gz>"
    exit 1
fi

echo "🔍 Verificando integridad de $BACKUP_FILE..."

# Extraer backup temporal
TEMP_DIR="temp_verify_$(date +%s)"
mkdir $TEMP_DIR
tar -xzf $BACKUP_FILE -C $TEMP_DIR

# Verificar checksums
BACKUP_EXTRACTED=$(find $TEMP_DIR -name "security_backup_*" -type d | head -1)

if [ -f "$BACKUP_EXTRACTED/integrity.sha256" ]; then
    cd $BACKUP_EXTRACTED
    if sha256sum -c integrity.sha256 --quiet; then
        echo "✅ Integridad verificada correctamente"
        RESULT=0
    else
        echo "❌ Fallo en verificación de integridad"
        RESULT=1
    fi
    cd - > /dev/null
else
    echo "⚠️  Archivo de integridad no encontrado"
    RESULT=1
fi

# Limpiar
rm -rf $TEMP_DIR

exit $RESULT
```

---

## ✅ Checklist de Seguridad

### Pre-Deploy Security Checklist

#### Configuración
- [ ] Variables de entorno configuradas correctamente
- [ ] No hay claves privadas en el código
- [ ] Headers de seguridad configurados
- [ ] CSP implementado y probado
- [ ] HTTPS configurado con certificado válido
- [ ] Redirects HTTP → HTTPS activos

#### Formularios
- [ ] Validación client-side implementada
- [ ] Sanitización de inputs activa
- [ ] Rate limiting configurado
- [ ] Protección CSRF implementada
- [ ] Validación de archivos subidos
- [ ] Límites de tamaño configurados

#### Contenido
- [ ] Imágenes optimizadas y con watermark
- [ ] Protección contra hotlinking
- [ ] Prevención de click derecho en portfolio
- [ ] Meta tags de seguridad configurados
- [ ] robots.txt configurado apropiadamente

#### Monitoreo
- [ ] Logging de seguridad activo
- [ ] Detección de ataques configurada
- [ ] Alertas críticas configuradas
- [ ] Backup automático programado
- [ ] Verificación de integridad activa

#### Testing
- [ ] Pruebas de penetración básicas realizadas
- [ ] Validación de formularios probada
- [ ] Headers de seguridad verificados
- [ ] CSP probado sin errores
- [ ] Certificado SSL verificado

### Checklist Mensual

#### Revisión de Seguridad
- [ ] Revisar logs de seguridad
- [ ] Verificar certificados SSL (renovación)
- [ ] Actualizar dependencias con vulnerabilidades
- [ ] Revisar configuración de headers
- [ ] Probar backups y recovery
- [ ] Verificar integridad de archivos críticos

#### Monitoreo
- [ ] Revisar métricas de ataques bloqueados
- [ ] Verificar funcionamiento de rate limiting
- [ ] Comprobar alertas de seguridad
- [ ] Revisar logs de formularios
- [ ] Verificar uptime y disponibilidad

### Respuesta a Incidentes

#### En caso de ataque detectado:

1. **Inmediato (0-15 minutos)**
   - [ ] Documentar el incidente
   - [ ] Evaluar el alcance del ataque
   - [ ] Activar modo de mantenimiento si es necesario
   - [ ] Notificar al equipo

2. **Corto plazo (15-60 minutos)**
   - [ ] Bloquear IPs maliciosas
   - [ ] Revisar logs detalladamente
   - [ ] Verificar integridad de datos
   - [ ] Implementar medidas correctivas

3. **Mediano plazo (1-24 horas)**
   - [ ] Realizar backup completo
   - [ ] Actualizar medidas de seguridad
   - [ ] Comunicar a usuarios si es necesario
   - [ ] Documentar lecciones aprendidas

4. **Largo plazo (1-7 días)**
   - [ ] Revisar y actualizar políticas de seguridad
   - [ ] Implementar mejoras preventivas
   - [ ] Capacitar al equipo
   - [ ] Actualizar documentación

---

## 📞 Contactos de Emergencia

### Servicios Críticos
- **Hosting (Netlify/Vercel):** Support tickets
- **Dominio:** Registrar del dominio
- **EmailJS:** support@emailjs.com
- **Google APIs:** Google Cloud Support

### Herramientas de Monitoreo
- **UptimeRobot:** Monitoreo de disponibilidad
- **Google Analytics:** Métricas de tráfico anómalo
- **Google Search Console:** Problemas de indexación

---

*Esta guía debe revisarse y actualizarse mensualmente para mantener la seguridad del sitio web.*