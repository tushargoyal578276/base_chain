"use strict";

function _classCallCheck(e, n) {
    if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function")
}

function _defineProperties(e, n) {
    for (var r = 0; r < n.length; r++) {
        var t = n[r];
        t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0), Object.defineProperty(e, t.key, t)
    }
}

function _createClass(e, n, r) {
    return n && _defineProperties(e.prototype, n), r && _defineProperties(e, r), e
}

function fluid_init() {
    var a = document.getElementsByTagName("canvas")[0];
    a.width = a.clientWidth, a.height = a.clientHeight;
    var e = a.getAttribute("data-fluid-bg") ? a.getAttribute("data-fluid-bg") : "#000000",
        n = a.getAttribute("data-sim-resol") ? a.getAttribute("data-sim-resol") : 128,
        r = a.getAttribute("data-quality") ? a.getAttribute("data-quality") : 512,
        t = a.getAttribute("data-density") ? a.getAttribute("data-density") : .97,
        i = a.getAttribute("data-vorticity") ? a.getAttribute("data-vorticity") : 30,
        o = a.getAttribute("data-splat-radius") ? a.getAttribute("data-splat-radius") : .5,
        u = function(e) {
            var n = 0,
                r = 0,
                t = 0;
            4 == e.length ? (n = "0x" + e[1] + e[1], r = "0x" + e[2] + e[2], t = "0x" + e[3] + e[3]) : 7 == e.length && (n = "0x" + e[1] + e[2], r = "0x" + e[3] + e[4], t = "0x" + e[5] + e[6]);
            return {
                r: n,
                g: r,
                b: t
            }
        }(e),
        v = !!a.getAttribute("data-transparent") && JSON.parse(a.getAttribute("data-transparent")),
        l = {
            SIM_RESOLUTION: n,
            DYE_RESOLUTION: r,
            DENSITY_DISSIPATION: t,
            VELOCITY_DISSIPATION: .98,
            PRESSURE_DISSIPATION: .8,
            PRESSURE_ITERATIONS: 20,
            COLOR_UPDATE_SPEED: 5,
            CURL: i,
            SPLAT_RADIUS: o,
            SHADING: !1,
            PAUSED: !1,
            BACK_COLOR: {
                r:0,
                g:0,
                b:0
            },
            // BACK_COLOR: {
            //     r: u.r,
            //     g: u.g,
            //     b: u.b
            // },
            TRANSPARENT: v,
            BLOOM: !0,
            BLOOM_ITERATIONS: 8,
            BLOOM_RESOLUTION: 256,
            BLOOM_INTENSITY: .8,
            BLOOM_THRESHOLD: .6,
            BLOOM_SOFT_KNEE: .7
        };
    var f = [],
        m = [],
        c = [];
    f.push(new function() {
        this.id = -1, this.x = 0, this.y = 0, this.dx = 0, this.dy = 0, this.down = !1, this.moved = !1, this.color = [30, 0, 300]
    });
    var s = function(e) {
            var n = {
                    alpha: !0,
                    depth: !1,
                    stencil: !1,
                    antialias: !1,
                    preserveDrawingBuffer: !1
                },
                r = e.getContext("webgl2", n),
                t = !!r;
            t || (r = e.getContext("webgl", n) || e.getContext("experimental-webgl", n));
            n = t ? (r.getExtension("EXT_color_buffer_float"), r.getExtension("OES_texture_float_linear")) : (o = r.getExtension("OES_texture_half_float"), r.getExtension("OES_texture_half_float_linear"));
            r.clearColor(0, 0, 0, 1);
            var i, a, o = t ? r.HALF_FLOAT : o.HALF_FLOAT_OES;
            t = t ? (i = h(r, r.RGBA16F, r.RGBA, o), a = h(r, r.RG16F, r.RG, o), h(r, r.R16F, r.RED, o)) : (i = h(r, r.RGBA, r.RGBA, o), a = h(r, r.RGBA, r.RGBA, o), h(r, r.RGBA, r.RGBA, o));
            return {
                gl: r,
                ext: {
                    formatRGBA: i,
                    formatRG: a,
                    formatR: t,
                    halfFloatTexType: o,
                    supportLinearFiltering: n
                }
            }
        }(a),
        g = s.gl,
        T = s.ext;

    function h(e, n, r, t) {
        if (! function(e, n, r, t) {
                var i = e.createTexture();
                e.bindTexture(e.TEXTURE_2D, i), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texImage2D(e.TEXTURE_2D, 0, n, 4, 4, 0, r, t, null);
                t = e.createFramebuffer();
                return e.bindFramebuffer(e.FRAMEBUFFER, t), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) == e.FRAMEBUFFER_COMPLETE
            }(e, n, r, t)) switch (n) {
            case e.R16F:
                return h(e, e.RG16F, e.RG, t);
            case e.RG16F:
                return h(e, e.RGBA16F, e.RGBA, t);
            default:
                return null
        }
        return {
            internalFormat: n,
            format: r
        }
    }
    /Mobi|Android/i.test(navigator.userAgent) && (l.SHADING = !1), T.supportLinearFiltering || (l.SHADING = !1, l.BLOOM = !1);
    var d = function() {
        function a(e, n) {
            if (_classCallCheck(this, a), this.uniforms = {}, this.program = g.createProgram(), g.attachShader(this.program, e), g.attachShader(this.program, n), g.linkProgram(this.program), !g.getProgramParameter(this.program, g.LINK_STATUS)) throw g.getProgramInfoLog(this.program);
            for (var r = g.getProgramParameter(this.program, g.ACTIVE_UNIFORMS), t = 0; t < r; t++) {
                var i = g.getActiveUniform(this.program, t).name;
                this.uniforms[i] = g.getUniformLocation(this.program, i)
            }
        }
        return _createClass(a, [{
            key: "bind",
            value: function() {
                g.useProgram(this.program)
            }
        }]), a
    }();

    function E(e, n) {
        e = g.createShader(e);
        if (g.shaderSource(e, n), g.compileShader(e), !g.getShaderParameter(e, g.COMPILE_STATUS)) throw g.getShaderInfoLog(e);
        return e
    }
    var x, R, p, D, _, A, b, y, S, L, F, U = E(g.VERTEX_SHADER, "\n        precision highp float;\n    \n        attribute vec2 aPosition;\n        varying vec2 vUv;\n        varying vec2 vL;\n        varying vec2 vR;\n        varying vec2 vT;\n        varying vec2 vB;\n        uniform vec2 texelSize;\n    \n        void main () {\n            vUv = aPosition * 0.5 + 0.5;\n            vL = vUv - vec2(texelSize.x, 0.0);\n            vR = vUv + vec2(texelSize.x, 0.0);\n            vT = vUv + vec2(0.0, texelSize.y);\n            vB = vUv - vec2(0.0, texelSize.y);\n            gl_Position = vec4(aPosition, 0.0, 1.0);\n        }\n    "),
        B = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying highp vec2 vUv;\n        uniform sampler2D uTexture;\n        uniform float value;\n    \n        void main () {\n            gl_FragColor = value * texture2D(uTexture, vUv);\n        }\n    "),
        w = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n    \n        uniform vec4 color;\n    \n        void main () {\n            gl_FragColor = color;\n        }\n    "),
        O = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uTexture;\n        uniform float aspectRatio;\n    \n        #define SCALE 25.0\n    \n        void main () {\n            vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));\n            float v = mod(uv.x + uv.y, 2.0);\n            v = v * 0.1 + 0.8;\n            gl_FragColor = vec4(vec3(v), 1.0);\n        }\n    "),
        C = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uTexture;\n    \n        void main () {\n            vec3 C = texture2D(uTexture, vUv).rgb;\n            float a = max(C.r, max(C.g, C.b));\n            gl_FragColor = vec4(C, a);\n        }\n    "),
        N = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uTexture;\n        uniform sampler2D uBloom;\n        uniform sampler2D uDithering;\n        uniform vec2 ditherScale;\n    \n        void main () {\n            vec3 C = texture2D(uTexture, vUv).rgb;\n            vec3 bloom = texture2D(uBloom, vUv).rgb;\n            vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;\n            noise = noise * 2.0 - 1.0;\n            bloom += noise / 800.0;\n            bloom = pow(bloom.rgb, vec3(1.0 / 2.2));\n            C += bloom;\n            float a = max(C.r, max(C.g, C.b));\n            gl_FragColor = vec4(C, a);\n        }\n    "),
        I = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        varying vec2 vL;\n        varying vec2 vR;\n        varying vec2 vT;\n        varying vec2 vB;\n        uniform sampler2D uTexture;\n        uniform vec2 texelSize;\n    \n        void main () {\n            vec3 L = texture2D(uTexture, vL).rgb;\n            vec3 R = texture2D(uTexture, vR).rgb;\n            vec3 T = texture2D(uTexture, vT).rgb;\n            vec3 B = texture2D(uTexture, vB).rgb;\n            vec3 C = texture2D(uTexture, vUv).rgb;\n    \n            float dx = length(R) - length(L);\n            float dy = length(T) - length(B);\n    \n            vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n            vec3 l = vec3(0.0, 0.0, 1.0);\n    \n            float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n            C.rgb *= diffuse;\n    \n            float a = max(C.r, max(C.g, C.b));\n            gl_FragColor = vec4(C, a);\n        }\n    "),
        P = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        varying vec2 vL;\n        varying vec2 vR;\n        varying vec2 vT;\n        varying vec2 vB;\n        uniform sampler2D uTexture;\n        uniform sampler2D uBloom;\n        uniform sampler2D uDithering;\n        uniform vec2 ditherScale;\n        uniform vec2 texelSize;\n    \n        void main () {\n            vec3 L = texture2D(uTexture, vL).rgb;\n            vec3 R = texture2D(uTexture, vR).rgb;\n            vec3 T = texture2D(uTexture, vT).rgb;\n            vec3 B = texture2D(uTexture, vB).rgb;\n            vec3 C = texture2D(uTexture, vUv).rgb;\n    \n            float dx = length(R) - length(L);\n            float dy = length(T) - length(B);\n    \n            vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n            vec3 l = vec3(0.0, 0.0, 1.0);\n    \n            float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n            C *= diffuse;\n    \n            vec3 bloom = texture2D(uBloom, vUv).rgb;\n            vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;\n            noise = noise * 2.0 - 1.0;\n            bloom += noise / 800.0;\n            bloom = pow(bloom.rgb, vec3(1.0 / 2.2));\n            C += bloom;\n    \n            float a = max(C.r, max(C.g, C.b));\n            gl_FragColor = vec4(C, a);\n        }\n    "),
        M = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uTexture;\n        uniform vec3 curve;\n        uniform float threshold;\n    \n        void main () {\n            vec3 c = texture2D(uTexture, vUv).rgb;\n            float br = max(c.r, max(c.g, c.b));\n            float rq = clamp(br - curve.x, 0.0, curve.y);\n            rq = curve.z * rq * rq;\n            c *= max(rq, br - threshold) / max(br, 0.0001);\n            gl_FragColor = vec4(c, 0.0);\n        }\n    "),
        G = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying vec2 vL;\n        varying vec2 vR;\n        varying vec2 vT;\n        varying vec2 vB;\n        uniform sampler2D uTexture;\n    \n        void main () {\n            vec4 sum = vec4(0.0);\n            sum += texture2D(uTexture, vL);\n            sum += texture2D(uTexture, vR);\n            sum += texture2D(uTexture, vT);\n            sum += texture2D(uTexture, vB);\n            sum *= 0.25;\n            gl_FragColor = sum;\n        }\n    "),
        e = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying vec2 vL;\n        varying vec2 vR;\n        varying vec2 vT;\n        varying vec2 vB;\n        uniform sampler2D uTexture;\n        uniform float intensity;\n    \n        void main () {\n            vec4 sum = vec4(0.0);\n            sum += texture2D(uTexture, vL);\n            sum += texture2D(uTexture, vR);\n            sum += texture2D(uTexture, vT);\n            sum += texture2D(uTexture, vB);\n            sum *= 0.25;\n            gl_FragColor = sum * intensity;\n        }\n    "),
        n = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uTarget;\n        uniform float aspectRatio;\n        uniform vec3 color;\n        uniform vec2 point;\n        uniform float radius;\n    \n        void main () {\n            vec2 p = vUv - point.xy;\n            p.x *= aspectRatio;\n            vec3 splat = exp(-dot(p, p) / radius) * color;\n            vec3 base = texture2D(uTarget, vUv).xyz;\n            gl_FragColor = vec4(base + splat, 1.0);\n        }\n    "),
        r = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uVelocity;\n        uniform sampler2D uSource;\n        uniform vec2 texelSize;\n        uniform vec2 dyeTexelSize;\n        uniform float dt;\n        uniform float dissipation;\n    \n        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n            vec2 st = uv / tsize - 0.5;\n    \n            vec2 iuv = floor(st);\n            vec2 fuv = fract(st);\n    \n            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n    \n            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n        }\n    \n        void main () {\n            vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n            gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);\n            gl_FragColor.a = 1.0;\n        }\n    "),
        t = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        uniform sampler2D uVelocity;\n        uniform sampler2D uSource;\n        uniform vec2 texelSize;\n        uniform float dt;\n        uniform float dissipation;\n    \n        void main () {\n            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n            gl_FragColor = dissipation * texture2D(uSource, coord);\n            gl_FragColor.a = 1.0;\n        }\n    "),
        i = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying highp vec2 vUv;\n        varying highp vec2 vL;\n        varying highp vec2 vR;\n        varying highp vec2 vT;\n        varying highp vec2 vB;\n        uniform sampler2D uVelocity;\n    \n        void main () {\n            float L = texture2D(uVelocity, vL).x;\n            float R = texture2D(uVelocity, vR).x;\n            float T = texture2D(uVelocity, vT).y;\n            float B = texture2D(uVelocity, vB).y;\n    \n            vec2 C = texture2D(uVelocity, vUv).xy;\n            if (vL.x < 0.0) { L = -C.x; }\n            if (vR.x > 1.0) { R = -C.x; }\n            if (vT.y > 1.0) { T = -C.y; }\n            if (vB.y < 0.0) { B = -C.y; }\n    \n            float div = 0.5 * (R - L + T - B);\n            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n        }\n    "),
        o = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying highp vec2 vUv;\n        varying highp vec2 vL;\n        varying highp vec2 vR;\n        varying highp vec2 vT;\n        varying highp vec2 vB;\n        uniform sampler2D uVelocity;\n    \n        void main () {\n            float L = texture2D(uVelocity, vL).y;\n            float R = texture2D(uVelocity, vR).y;\n            float T = texture2D(uVelocity, vT).x;\n            float B = texture2D(uVelocity, vB).x;\n            float vorticity = R - L - T + B;\n            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n        }\n    "),
        u = E(g.FRAGMENT_SHADER, "\n        precision highp float;\n        precision highp sampler2D;\n    \n        varying vec2 vUv;\n        varying vec2 vL;\n        varying vec2 vR;\n        varying vec2 vT;\n        varying vec2 vB;\n        uniform sampler2D uVelocity;\n        uniform sampler2D uCurl;\n        uniform float curl;\n        uniform float dt;\n    \n        void main () {\n            float L = texture2D(uCurl, vL).x;\n            float R = texture2D(uCurl, vR).x;\n            float T = texture2D(uCurl, vT).x;\n            float B = texture2D(uCurl, vB).x;\n            float C = texture2D(uCurl, vUv).x;\n    \n            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n            force /= length(force) + 0.0001;\n            force *= curl * C;\n            force.y *= -1.0;\n    \n            vec2 vel = texture2D(uVelocity, vUv).xy;\n            gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);\n        }\n    "),
        v = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying highp vec2 vUv;\n        varying highp vec2 vL;\n        varying highp vec2 vR;\n        varying highp vec2 vT;\n        varying highp vec2 vB;\n        uniform sampler2D uPressure;\n        uniform sampler2D uDivergence;\n    \n        vec2 boundary (vec2 uv) {\n            return uv;\n            // uncomment if you use wrap or repeat texture mode\n            // uv = min(max(uv, 0.0), 1.0);\n            // return uv;\n        }\n    \n        void main () {\n            float L = texture2D(uPressure, boundary(vL)).x;\n            float R = texture2D(uPressure, boundary(vR)).x;\n            float T = texture2D(uPressure, boundary(vT)).x;\n            float B = texture2D(uPressure, boundary(vB)).x;\n            float C = texture2D(uPressure, vUv).x;\n            float divergence = texture2D(uDivergence, vUv).x;\n            float pressure = (L + R + B + T - divergence) * 0.25;\n            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n        }\n    "),
        s = E(g.FRAGMENT_SHADER, "\n        precision mediump float;\n        precision mediump sampler2D;\n    \n        varying highp vec2 vUv;\n        varying highp vec2 vL;\n        varying highp vec2 vR;\n        varying highp vec2 vT;\n        varying highp vec2 vB;\n        uniform sampler2D uPressure;\n        uniform sampler2D uVelocity;\n    \n        vec2 boundary (vec2 uv) {\n            return uv;\n            // uv = min(max(uv, 0.0), 1.0);\n            // return uv;\n        }\n    \n        void main () {\n            float L = texture2D(uPressure, boundary(vL)).x;\n            float R = texture2D(uPressure, boundary(vR)).x;\n            float T = texture2D(uPressure, boundary(vT)).x;\n            float B = texture2D(uPressure, boundary(vB)).x;\n            vec2 velocity = texture2D(uVelocity, vUv).xy;\n            velocity.xy -= vec2(R - L, T - B);\n            gl_FragColor = vec4(velocity, 0.0, 1.0);\n        }\n    "),
        H = (g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()), g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW), g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer()), g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW), g.vertexAttribPointer(0, 2, g.FLOAT, !1, 0, 0), g.enableVertexAttribArray(0), function(e) {
            g.bindFramebuffer(g.FRAMEBUFFER, e), g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
        }),
        X = (F = g.createTexture(), g.bindTexture(g.TEXTURE_2D, F), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT), g.texImage2D(g.TEXTURE_2D, 0, g.RGB, 1, 1, 0, g.RGB, g.UNSIGNED_BYTE, new Uint8Array([255, 255, 255])), {
            texture: F,
            width: 1,
            height: 1,
            attach: function(e) {
                return g.activeTexture(g.TEXTURE0 + e), g.bindTexture(g.TEXTURE_2D, F), e
            }
        }),
        z = new d(U, B),
        V = new d(U, w),
        Y = new d(U, O),
        W = new d(U, C),
        k = new d(U, N),
        q = new d(U, I),
        K = new d(U, P),
        j = new d(U, M),
        J = new d(U, G),
        Q = new d(U, e),
        Z = new d(U, n),
        $ = new d(U, T.supportLinearFiltering ? t : r),
        ee = new d(U, i),
        ne = new d(U, o),
        re = new d(U, u),
        te = new d(U, v),
        ie = new d(U, s);

    function ae() {
        var e = he(l.SIM_RESOLUTION),
            n = he(l.DYE_RESOLUTION);
        x = e.width, R = e.height, p = n.width, D = n.height;
        var r = T.halfFloatTexType,
            t = T.formatRGBA,
            i = T.formatRG,
            e = T.formatR,
            n = T.supportLinearFiltering ? g.LINEAR : g.NEAREST;
        _ = null == _ ? ue(p, D, t.internalFormat, t.format, r, n) : ve(_, p, D, t.internalFormat, t.format, r, n), A = null == A ? ue(x, R, i.internalFormat, i.format, r, n) : ve(A, x, R, i.internalFormat, i.format, r, n), b = oe(x, R, e.internalFormat, e.format, r, g.NEAREST), y = oe(x, R, e.internalFormat, e.format, r, g.NEAREST), S = ue(x, R, e.internalFormat, e.format, r, g.NEAREST),
            function() {
                var e = he(l.BLOOM_RESOLUTION),
                    n = T.halfFloatTexType,
                    r = T.formatRGBA,
                    t = T.supportLinearFiltering ? g.LINEAR : g.NEAREST;
                L = oe(e.width, e.height, r.internalFormat, r.format, n, t);
                for (var i = c.length = 0; i < l.BLOOM_ITERATIONS; i++) {
                    var a = e.width >> i + 1,
                        o = e.height >> i + 1;
                    if (a < 2 || o < 2) break;
                    o = oe(a, o, r.internalFormat, r.format, n, t);
                    c.push(o)
                }
            }()
    }

    function oe(e, n, r, t, i, a) {
        g.activeTexture(g.TEXTURE0);
        var o = g.createTexture();
        g.bindTexture(g.TEXTURE_2D, o), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, a), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, a), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE), g.texImage2D(g.TEXTURE_2D, 0, r, e, n, 0, t, i, null);
        i = g.createFramebuffer();
        return g.bindFramebuffer(g.FRAMEBUFFER, i), g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, o, 0), g.viewport(0, 0, e, n), g.clear(g.COLOR_BUFFER_BIT), {
            texture: o,
            fbo: i,
            width: e,
            height: n,
            attach: function(e) {
                return g.activeTexture(g.TEXTURE0 + e), g.bindTexture(g.TEXTURE_2D, o), e
            }
        }
    }

    function ue(e, n, r, t, i, a) {
        var o = oe(e, n, r, t, i, a),
            u = oe(e, n, r, t, i, a);
        return {
            get read() {
                return o
            },
            set read(e) {
                o = e
            },
            get write() {
                return u
            },
            set write(e) {
                u = e
            },
            swap: function() {
                var e = o;
                o = u, u = e
            }
        }
    }

    function ve(e, n, r, t, i, a, o) {
        var u, v;
        return e.read = (u = e.read, v = oe(n, r, t, i, a, v = o), z.bind(), g.uniform1i(z.uniforms.uTexture, u.attach(0)), g.uniform1f(z.uniforms.value, 1), H(v.fbo), v), e.write = oe(n, r, t, i, a, o), e
    }

    function fe() {
        0 < m.length && se(m.pop());
        for (var e = 0; e < f.length; e++) {
            var n = f[e];
            n.moved && (ce(n.x, n.y, n.dx, n.dy, n.color), n.moved = !1)
        }
    }

    function le(e) {
        g.disable(g.BLEND), g.viewport(0, 0, x, R), ne.bind(), g.uniform2f(ne.uniforms.texelSize, 1 / x, 1 / R), g.uniform1i(ne.uniforms.uVelocity, A.read.attach(0)), H(y.fbo), re.bind(), g.uniform2f(re.uniforms.texelSize, 1 / x, 1 / R), g.uniform1i(re.uniforms.uVelocity, A.read.attach(0)), g.uniform1i(re.uniforms.uCurl, y.attach(1)), g.uniform1f(re.uniforms.curl, l.CURL), g.uniform1f(re.uniforms.dt, e), H(A.write.fbo), A.swap(), ee.bind(), g.uniform2f(ee.uniforms.texelSize, 1 / x, 1 / R), g.uniform1i(ee.uniforms.uVelocity, A.read.attach(0)), H(b.fbo), z.bind(), g.uniform1i(z.uniforms.uTexture, S.read.attach(0)), g.uniform1f(z.uniforms.value, l.PRESSURE_DISSIPATION), H(S.write.fbo), S.swap(), te.bind(), g.uniform2f(te.uniforms.texelSize, 1 / x, 1 / R), g.uniform1i(te.uniforms.uDivergence, b.attach(0));
        for (var n = 0; n < l.PRESSURE_ITERATIONS; n++) g.uniform1i(te.uniforms.uPressure, S.read.attach(1)), H(S.write.fbo), S.swap();
        ie.bind(), g.uniform2f(ie.uniforms.texelSize, 1 / x, 1 / R), g.uniform1i(ie.uniforms.uPressure, S.read.attach(0)), g.uniform1i(ie.uniforms.uVelocity, A.read.attach(1)), H(A.write.fbo), A.swap(), $.bind(), g.uniform2f($.uniforms.texelSize, 1 / x, 1 / R), T.supportLinearFiltering || g.uniform2f($.uniforms.dyeTexelSize, 1 / x, 1 / R);
        var r = A.read.attach(0);
        g.uniform1i($.uniforms.uVelocity, r), g.uniform1i($.uniforms.uSource, r), g.uniform1f($.uniforms.dt, e), g.uniform1f($.uniforms.dissipation, l.VELOCITY_DISSIPATION), H(A.write.fbo), A.swap(), g.viewport(0, 0, p, D), T.supportLinearFiltering || g.uniform2f($.uniforms.dyeTexelSize, 1 / p, 1 / D), g.uniform1i($.uniforms.uVelocity, A.read.attach(0)), g.uniform1i($.uniforms.uSource, _.read.attach(1)), g.uniform1f($.uniforms.dissipation, l.DENSITY_DISSIPATION), H(_.write.fbo), _.swap()
    }

    function me(e) {
        l.BLOOM && function(e, n) {
            if (!(c.length < 2)) {
                var r = n;
                g.disable(g.BLEND), j.bind();
                var t = l.BLOOM_THRESHOLD * l.BLOOM_SOFT_KNEE + 1e-4,
                    i = l.BLOOM_THRESHOLD - t,
                    a = 2 * t,
                    t = .25 / t;
                g.uniform3f(j.uniforms.curve, i, a, t), g.uniform1f(j.uniforms.threshold, l.BLOOM_THRESHOLD), g.uniform1i(j.uniforms.uTexture, e.attach(0)), g.viewport(0, 0, r.width, r.height), H(r.fbo), J.bind();
                for (var o = 0; o < c.length; o++) {
                    var u = c[o];
                    g.uniform2f(J.uniforms.texelSize, 1 / r.width, 1 / r.height), g.uniform1i(J.uniforms.uTexture, r.attach(0)), g.viewport(0, 0, u.width, u.height), H(u.fbo), r = u
                }
                g.blendFunc(g.ONE, g.ONE), g.enable(g.BLEND);
                for (var v = c.length - 2; 0 <= v; v--) {
                    var f = c[v];
                    g.uniform2f(J.uniforms.texelSize, 1 / r.width, 1 / r.height), g.uniform1i(J.uniforms.uTexture, r.attach(0)), g.viewport(0, 0, f.width, f.height), H(f.fbo), r = f
                }
                g.disable(g.BLEND), Q.bind(), g.uniform2f(Q.uniforms.texelSize, 1 / r.width, 1 / r.height), g.uniform1i(Q.uniforms.uTexture, r.attach(0)), g.uniform1f(Q.uniforms.intensity, l.BLOOM_INTENSITY), g.viewport(0, 0, n.width, n.height), H(n.fbo)
            }
        }(_.read, L), null != e && l.TRANSPARENT ? g.disable(g.BLEND) : (g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA), g.enable(g.BLEND));
        var n, r, t = null == e ? g.drawingBufferWidth : p,
            i = null == e ? g.drawingBufferHeight : D;
        g.viewport(0, 0, t, i), l.TRANSPARENT || (V.bind(), n = l.BACK_COLOR, g.uniform4f(V.uniforms.color, n.r / 255, n.g / 255, n.b / 255, 1), H(e)), null == e && l.TRANSPARENT && (Y.bind(), g.uniform1f(Y.uniforms.aspectRatio, a.width / a.height), H(null)), l.SHADING ? ((n = l.BLOOM ? K : q).bind(), g.uniform2f(n.uniforms.texelSize, 1 / t, 1 / i), g.uniform1i(n.uniforms.uTexture, _.read.attach(0)), l.BLOOM && (g.uniform1i(n.uniforms.uBloom, L.attach(1)), g.uniform1i(n.uniforms.uDithering, X.attach(2)), r = de(X, t, i), g.uniform2f(n.uniforms.ditherScale, r.x, r.y))) : ((r = l.BLOOM ? k : W).bind(), g.uniform1i(r.uniforms.uTexture, _.read.attach(0)), l.BLOOM && (g.uniform1i(r.uniforms.uBloom, L.attach(1)), g.uniform1i(r.uniforms.uDithering, X.attach(2)), i = de(X, t, i), g.uniform2f(r.uniforms.ditherScale, i.x, i.y))), H(e)
    }

    function ce(e, n, r, t, i) {
        g.viewport(0, 0, x, R), Z.bind(), g.uniform1i(Z.uniforms.uTarget, A.read.attach(0)), g.uniform1f(Z.uniforms.aspectRatio, a.width / a.height), g.uniform2f(Z.uniforms.point, e / a.width, 1 - n / a.height), g.uniform3f(Z.uniforms.color, r, -t, 1), g.uniform1f(Z.uniforms.radius, l.SPLAT_RADIUS / 100), H(A.write.fbo), A.swap(), g.viewport(0, 0, p, D), g.uniform1i(Z.uniforms.uTarget, _.read.attach(0)), g.uniform3f(Z.uniforms.color, i.r, i.g, i.b), H(_.write.fbo), _.swap()
    }

    function se(e) {
        for (var n = 0; n < e; n++) {
            var r = Te();
            r.r *= 10, r.g *= 10, r.b *= 10, ce(a.width * Math.random(), a.height * Math.random(), 1e3 * (Math.random() - .5), 1e3 * (Math.random() - .5), r)
        }
    }

    function ge() {
        a.width == a.clientWidth && a.height == a.clientHeight || (a.width = a.clientWidth, a.height = a.clientHeight, ae())
    }

    function Te() {
        var e = function(e, n, r) {
            var t, i, a, o, u, v, f;
            switch (o = Math.floor(6 * e), u = r * (1 - n), v = r * (1 - (e = 6 * e - o) * n), f = r * (1 - (1 - e) * n), o % 6) {
                case 0:
                    t = r, i = f, a = u;
                    break;
                case 1:
                    t = v, i = r, a = u;
                    break;
                case 2:
                    t = u, i = r, a = f;
                    break;
                case 3:
                    t = u, i = v, a = r;
                    break;
                case 4:
                    t = f, i = u, a = r;
                    break;
                case 5:
                    t = r, i = u, a = v
            }
            return {
                r: t,
                g: i,
                b: a
            }
        }(Math.random(), 1, 1);
        return e.r *= .15, e.g *= .15, e.b *= .15, e
    }

    function he(e) {
        var n = g.drawingBufferWidth / g.drawingBufferHeight;
        n < 1 && (n = 1 / n);
        n = Math.round(e * n), e = Math.round(e);
        return g.drawingBufferWidth > g.drawingBufferHeight ? {
            width: n,
            height: e
        } : {
            width: e,
            height: n
        }
    }

    function de(e, n, r) {
        return {
            x: n / e.width,
            y: r / e.height
        }
    }
    ae(), se(parseInt(20 * Math.random()) + 5),
        function e() {
            ge();
            fe();
            l.PAUSED || le(.016);
            me(null);
            requestAnimationFrame(e)
        }(), document.querySelector(".nicol").addEventListener("mousemove", function(e) {
            f[0].down = !0, f[0].color = Te(), f[0].moved = f[0].down, f[0].dx = 5 * (e.clientX - f[0].x), f[0].dy = 5 * (e.clientY - f[0].y), f[0].x = e.clientX, f[0].y = e.clientY
        });
    s = document.querySelector(".nicol-boom");
    null !== s && s.addEventListener("click", function(e) {
        se(parseInt(20 * Math.random()) + 5)
    })
}
window.ajax_flag ? fluid_init() : window.onload = function() {
    fluid_init()
};