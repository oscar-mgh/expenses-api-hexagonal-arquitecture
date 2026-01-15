# Decisiones Técnicas Importantes

### Arquitectura Hexagonal (Ports & Adapters)
* **Evolución:** Inicialmente se consideró usar una arquitectura modular; tras una investigación minuciosa, se logró implementar con éxito la arquitectura hexagonal.
* **Propósito:** Se adoptó para desacoplar la lógica de negocio de los detalles técnicos (base de datos, frameworks, APIs) usando casos de uso sin el decorador @Injectable para mantener la optimizacion de Plain Old JavaScript/TypeScript Objects.
* **Independencia:** El **dominio** se conecta eficientemente mediante puertos e interfaces.

### Modelado de montos monetarios como `string`
* **Manejo de Datos:** Aunque la API recibe `amount` como `string` validado (`@IsNumberString`), se almacena como `numeric` en PostgreSQL y se mantiene como `string` en el dominio.
* **Razón:** Esto evita problemas de precisión con números decimales en JavaScript y garantiza consistencia con TypeORM.

### Manejo centralizado de errores
* **Estandarización:** Se implementó un `HttpExceptionFilter` global para estandarizar respuestas de error (400, 404, 500, etc.) sin necesidad de `try/catch` en controladores.
* **Excepciones:** Todos los errores de negocio (ej: *"gasto no encontrado"*) se lanzan como excepciones HTTP estándar desde los casos de uso.

### Ordenamiento estable en paginación
* **Consistencia:** En `findAll`, se ordena por `date DESC` + `id DESC` para garantizar resultados consistentes incluso con fechas duplicadas.

### Validación temprana con `ValidationPipe`
* **Configuración Global:** Se activó con `whitelist`, `forbidNonWhitelisted` y `stopAtFirstError` para rechazar entradas maliciosas.
* **Transformación:** Se usa `transform` para validar y tipar correctamente los datos que vienen de `@Query` y `@Param`.

---

# Desafíos Enfrentados

* **Conocimiento de una estructura clara:** Al investigar sobre la estructura más común de carpetas y archivos que se usan en la arquitectura hexagonal, opté por usar la estructura que fue sugerida, la dificultad fue saber como se usan los DTOs y como se relacionan realmente con los puertos
* **Alineación de tipos:** Resolución de conflictos iniciales al usar `number` en DTOs y `string` en la entidad. Se estandarizó `amount` como `string` en toda la cadena.
* **Desacoplamiento de puertos:** Corrección de la arquitectura para que los puertos del repositorio solo acepten objetos del dominio (`Expense`, `Partial<Expense>`) y no DTOs.
* **Paginación eficiente:** Implementación de `getManyAndCount()` con filtros dinámicos y validación de campos permitidos para evitar riesgos de inyección SQL.
* **Seguridad CORS:** Transición de una configuración abierta a una lista blanca segura basada en variables de entorno.

---

# Posibles Mejoras Futuras

> **Pruebas unitarias:** La estructura desacoplada del código hace que agregar tests unitarios e integrales sea directo y de alto impacto. Priorizar su implementación aumentaría la resiliencia del sistema y facilitaría la evolución futura.

---

# Tiempo Invertido

| Actividad | Horas |
| :--- | :---: |
| Diseño e implementación inicial | 10h |
| Arquitectura hexagonal y capas | 04h |
| Manejo de errores y validaciones | 02h |
| Paginación, ordenamiento y filtros | 02h |
| Documentación y refinamiento | 04h |
| Análisis e implementación de func. opcionales | 10h |
| **Total Estimado** | **~32 horas** |

---