/*
==============================================================================
    Solace Systems, Inc.
    SOLACE SYSTEMS MESSAGING API FOR JAVASCRIPT
    SolclientJS
==============================================================================
    6.2.0.5 - Release
    20131031-1626
------------------------------------------------------------------------------
 Copyright (C) 2009-2013 Solace Systems, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to use and
 copy the Software, and to permit persons to whom the Software is furnished to
 do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 UNLESS STATED ELSEWHERE BETWEEN YOU AND SOLACE SYSTEMS, INC., THE SOFTWARE IS
 PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 http://www.SolaceSystems.com

------------------------------------------------------------------------------
*/
if (typeof window.solace === "undefined") var solace = {};
(function(a) {
    var g = function() {
        var b = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            k = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-+]\d{4})?)\b/g,
            j = /[^\-+\dA-Z]/g,
            n = function(p, r) {
                p = String(p);
                for (r = r || 2; p.length < r;) p = "0" + p;
                return p
            };
        return function(p, r, d) {
            var h = g;
            if (arguments.length === 1 && Object.prototype.toString.call(p) === "[object String]" && !/\d/.test(p)) {
                r = p;
                p = undefined
            }
            p = p ? new Date(p) : new Date;
            if (isNaN(p)) throw new SyntaxError("invalid date");
            r = String(h.masks[r] || r || h.masks["default"]);
            if (r.slice(0, 4) === "UTC:") {
                r = r.slice(4);
                d = true
            }
            var e = d ? "getUTC" : "get",
                i = p[e + "Date"](),
                l = p[e + "Day"](),
                c = p[e + "Month"](),
                f = p[e + "FullYear"](),
                o = p[e + "Hours"](),
                m = p[e + "Minutes"](),
                s = p[e + "Seconds"]();
            e = p[e + "Milliseconds"]();
            var t = d ? 0 : p.getTimezoneOffset(),
                q = {
                    d: i,
                    dd: n(i),
                    ddd: h.i18n.dayNames[l],
                    dddd: h.i18n.dayNames[l + 7],
                    m: c + 1,
                    mm: n(c + 1),
                    mmm: h.i18n.monthNames[c],
                    mmmm: h.i18n.monthNames[c + 12],
                    yy: String(f).slice(2),
                    yyyy: f,
                    h: o % 12 || 12,
                    hh: n(o % 12 || 12),
                    H: o,
                    HH: n(o),
                    M: m,
                    MM: n(m),
                    s: s,
                    ss: n(s),
                    l: n(e, 3),
                    L: n(e > 99 ? Math.round(e / 10) : e),
                    t: o < 12 ? "a" : "p",
                    tt: o < 12 ? "am" : "pm",
                    T: o < 12 ? "A" : "P",
                    TT: o < 12 ? "AM" : "PM",
                    Z: d ? "UTC" : (String(p).match(k) || [""]).pop().replace(j, ""),
                    o: (t > 0 ? "-" : "+") + n(Math.floor(Math.abs(t) / 60) * 100 + Math.abs(t) % 60, 4),
                    S: ["th", "st", "nd", "rd"][i % 10 > 3 ? 0 : (i % 100 - i % 10 !== 10) * i % 10]
                };
            return r.replace(b, function(u) {
                return q.hasOwnProperty(u) ? q[u] : u.slice(1, u.length - 1)
            })
        }
    }();
    g.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    g.i18n = {
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August",
            "September", "October", "November", "December"
        ]
    };
    Date.prototype.format = function(b, k) {
        return g(this, b, k)
    };
    if (!Array.prototype.indexOf) Array.prototype.indexOf = function(b, k) {
        for (var j = k || 0; j < this.length; j++)
            if (this[j] === b) return j;
        return -1
    };
    if (!Array.prototype.map) Array.prototype.map = function(b, k) {
        for (var j = [], n = 0, p = this.length; n < p; n++)
            if (n in this) j[n] = b.call(k, this[n], n, this);
        return j
    };
    a.Convert = function() {
        var b = String.fromCharCode(0, 0, 0),
            k = String.fromCharCode(0, 0);
        return {
            int8ToStr: function(j) {
                return String.fromCharCode(j &
                    255)
            },
            int16ToStr: function(j) {
                return String.fromCharCode(j >> 8 & 255) + String.fromCharCode(j & 255)
            },
            int24ToStr: function(j) {
                return String.fromCharCode(j >> 16 & 255) + String.fromCharCode(j >> 8 & 255) + String.fromCharCode(j & 255)
            },
            int32ToStr: function(j) {
                return j >= 0 && j < 256 ? b + String.fromCharCode(j) : j >= 0 && j < 65536 ? k + String.fromCharCode(j >> 8) + String.fromCharCode(j & 255) : String.fromCharCode(j >> 24 & 255) + String.fromCharCode(j >> 16 & 255) + String.fromCharCode(j >> 8 & 255) + String.fromCharCode(j & 255)
            },
            byteArrayToStr: function(j) {
                var n =
                    j.length;
                if (n < 8192) return String.fromCharCode.apply(null, j);
                else {
                    for (var p = 0, r = ""; p < n;) {
                        r += String.fromCharCode.apply(null, j.slice(p, p + 8192));
                        p += 8192
                    }
                    return r
                }
            },
            strToByteArray: function(j) {
                for (var n = [], p = 0; p < j.length; p++) n[p] = j.charCodeAt(p);
                return n
            },
            strToHexArray: function(j) {
                return Array.prototype.map.call(j.split(""), function(n) {
                    return n.charCodeAt(0).toString(16)
                })
            },
            strToInt8: function(j) {
                return j.charCodeAt(0) & 255
            },
            strToInt16: function(j) {
                return (j.charCodeAt(0) << 8) + j.charCodeAt(1)
            },
            strToInt24: function(j) {
                return (j.charCodeAt(0) <<
                    16) + (j.charCodeAt(1) << 8) + j.charCodeAt(2)
            },
            strToInt32: function(j) {
                return (j.charCodeAt(0) << 24) + (j.charCodeAt(1) << 16) + (j.charCodeAt(2) << 8) + j.charCodeAt(3)
            },
            strToUInt32: function(j) {
                return j.charCodeAt(0) * 16777216 + (j.charCodeAt(1) << 16) + (j.charCodeAt(2) << 8) + j.charCodeAt(3)
            }
        }
    }();
    a.Base64 = function() {
        var b = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 99, -1, -1, 99, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 99, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2,
            3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
        ];
        return {
            encode: function(k) {
                var j = "",
                    n, p, r, d, h, e, i = 0;
                do {
                    n = k.charCodeAt(i++);
                    p = k.charCodeAt(i++);
                    r = k.charCodeAt(i++);
                    d = n >> 2;
                    n = (n & 3) << 4 | p >> 4;
                    h = (p & 15) << 2 | r >> 6;
                    e = r & 63;
                    if (isNaN(p)) h = e = 64;
                    else if (isNaN(r)) e = 64;
                    j = j + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(d) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(n) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e)
                } while (i <
                    k.length);
                return j
            },
            decode: function(k) {
                var j = "",
                    n, p, r, d, h, e = 0;
                do {
                    for (; b[k.charCodeAt(e)] > 64;) e++;
                    n = b[k.charCodeAt(e++)];
                    p = b[k.charCodeAt(e++)];
                    d = b[k.charCodeAt(e++)];
                    h = b[k.charCodeAt(e++)];
                    if (n < 0 || p < 0 || d < 0 || h < 0) throw new a.TransportError("Invalid base64 character in data stream", a.TransportSessionEventCode.DATA_DECODE_ERROR);
                    n = n << 2 | p >> 4;
                    p = (p & 15) << 4 | d >> 2;
                    r = (d & 3) << 6 | h;
                    j += String.fromCharCode(n);
                    if (d !== 64) j += String.fromCharCode(p);
                    if (h !== 64) j += String.fromCharCode(r)
                } while (e < k.length - 3);
                return j
            }
        }
    }();
    if (window.atob && window.btoa) {
        a.base64_encode = function(b) {
            return window.btoa(b)
        };
        a.base64_decode = function(b) {
            return window.atob(b)
        }
    } else {
        a.base64_encode = a.Base64.encode;
        a.base64_decode = a.Base64.decode
    }
    a.ObjectUtil = function() {
        var b = function() {
            try {
                if (Object.defineProperty) {
                    var k = function(p, r, d) {
                            Object.defineProperty(p, r, {
                                configurable: false,
                                enumerable: true,
                                writable: false,
                                value: d
                            });
                            return p
                        },
                        j = k({}, "testProp", false);
                    if (typeof j.testProp === "undefined" || j.testProp !== false) throw Error("Property definition failed");
                    return k
                }
            } catch (n) {}
            return function(p, r, d) {
                p[r] = d;
                return p
            }
        }();
        return b({}, "defineReadOnlyProperty", b)
    }();
    a.TopicUtil = function() {
        return {
            toSafeChars: function(b) {
                return b = b.replace(/[^a-zA-Z0-9_\/.]/g, "")
            },
            validateTopic: function(b) {
                if (typeof b !== "string") return "topicName must be a string.";
                var k = b.length;
                if (k < 1) return "Topic too short (must be >= 1 character).";
                else if (k > 250) return "Topic too long (must be <= 250 characters).";
                for (var j = 0; j < k; j++) {
                    var n = b.charAt(j);
                    if (n === "/") {
                        if (j === 0 || j === k - 1 || b.charAt(j -
                                1) === "/") return "Topic has empty level."
                    } else if (n === "*" && j < k - 1)
                        if (b.charAt(j + 1) !== "/") return "Topic has illegal wildcard."
                }
                return null
            },
            isWildcarded: function(b) {
                var k = b.length;
                if (b === ">") return true;
                else if (k >= 2 && b.charAt(k - 2) === "/" && b.charAt(k - 1) === ">") return true;
                else if (b.indexOf("*", 0) !== -1) return true;
                return false
            }
        }
    }();
    a.EnumUtil = function() {
        return {
            name: function(b, k) {
                for (var j in b)
                    if (b.hasOwnProperty(j))
                        if (k === b[j]) return j;
                return null
            }
        }
    }();
    a.StringBuffer = function() {
        this.buffer = [];
        arguments.length ===
            1 && this.buffer.push(arguments[0])
    };
    a.StringBuffer.prototype.append = function(b) {
        typeof b !== "undefined" && this.buffer.push(b);
        return this
    };
    a.StringBuffer.prototype.toString = function() {
        return this.buffer.join("")
    };
    a.StringUtil = function() {
        function b(k, j, n, p) {
            if (typeof k === "string")
                if (k.length < j) {
                    var r = " ";
                    if (typeof p === "string" && p.length === 1) r = p;
                    p = new a.StringBuffer;
                    for (var d = 0; d < j - k.length; d++) p.append(r);
                    switch (n) {
                        case 0:
                            return p.toString() + k;
                        case 1:
                            return k + p.toString()
                    }
                } return k
        }
        return {
            padLeft: function(k,
                j, n) {
                return b(k, j, 0, n)
            },
            padRight: function(k, j, n) {
                return b(k, j, 1, n)
            },
            notEmpty: function(k) {
                return typeof k !== "undefined" && k !== null && k.length > 0
            },
            formatDumpBytes: function(k, j, n) {
                if (!this.notEmpty(k)) return null;
                for (var p = [], r = [], d = [], h = 0, e = function() {
                        for (var f = [], o = 0; o < 256; o++) f[o] = o < 33 || o > 126 ? "." : String.fromCharCode(o);
                        return f
                    }(), i = 0, l = k.length; i < l; i++) {
                    var c = k.charCodeAt(i);
                    d.push(this.padLeft(c.toString(16), 2, "0"));
                    d.push(" ");
                    r.push(e[c] || ".");
                    h++;
                    h === 8 && d.push("   ");
                    if (h === 16 || i === k.length - 1) {
                        n >
                            0 && p.push(this.padRight("", n, " "));
                        p.push(this.padRight(d.join(""), 54, " "));
                        j && p.push(r.join(""));
                        p.push("\n");
                        d = [];
                        r = [];
                        h = 0
                    }
                }
                return p.join("")
            }
        }
    }();
    a.Version = function() {
        var b = {};
        a.ObjectUtil.defineReadOnlyProperty(b, "version", "6.2.0.5");
        a.ObjectUtil.defineReadOnlyProperty(b, "date", "20131031-1626");
        a.ObjectUtil.defineReadOnlyProperty(b, "mode", "Release");
        a.ObjectUtil.defineReadOnlyProperty(b, "summary", ["SolclientJS", b.version, b.mode, b.date].join(", "));
        a.ObjectUtil.defineReadOnlyProperty(b,
            "toString",
            function() {
                return b.summary
            });
        return b
    }()
})(solace);
var detected_console = typeof this.global !== "undefined" && this.global ? this.global.console : typeof this.window !== "undefined" && this.window ? typeof this.window.console !== "undefined" ? this.window.console : null : null;
(function(a, g) {
    a.ErrorSubcode = {
        UNKNOWN_ERROR: 999,
        SESSION_NOT_CONNECTED: 2,
        INVALID_SESSION_OPERATION: 3,
        TIMEOUT: 4,
        MESSAGE_VPN_NOT_ALLOWED: 5,
        MESSAGE_VPN_UNAVAILABLE: 6,
        CLIENT_USERNAME_IS_SHUTDOWN: 7,
        DYNAMIC_CLIENTS_NOT_ALLOWED: 8,
        CLIENT_NAME_ALREADY_IN_USE: 9,
        CLIENT_NAME_INVALID: 10,
        CLIENT_DELETE_IN_PROGRESS: 11,
        TOO_MANY_CLIENTS: 12,
        LOGIN_FAILURE: 13,
        INVALID_VIRTUAL_ADDRESS: 14,
        CLIENT_ACL_DENIED: 15,
        SUBSCRIPTION_ACL_DENIED: 16,
        PUBLISH_ACL_DENIED: 17,
        PARAMETER_OUT_OF_RANGE: 18,
        PARAMETER_CONFLICT: 19,
        PARAMETER_INVALID_TYPE: 20,
        INTERNAL_ERROR: 21,
        INSUFFICIENT_SPACE: 22,
        OUT_OF_RESOURCES: 23,
        PROTOCOL_ERROR: 24,
        COMMUNICATION_ERROR: 25,
        KEEP_ALIVE_FAILURE: 26,
        TOPIC_MISSING: 28,
        INVALID_TOPIC_SYNTAX: 31,
        MESSAGE_TOO_LARGE: 32,
        XML_PARSE_ERROR: 33,
        SUBSCRIPTION_ALREADY_PRESENT: 34,
        SUBSCRIPTION_NOT_FOUND: 35,
        SUBSCRIPTION_INVALID: 36,
        SUBSCRIPTION_ERROR_OTHER: 37,
        SUBSCRIPTION_TOO_MANY: 38,
        SUBSCRIPTION_ATTRIBUTES_CONFLICT: 39,
        NO_LOCAL_NOT_SUPPORTED: 40,
        DATA_ERROR_OTHER: 42,
        CREATE_XHR_FAILED: 43,
        INTERNAL_CONNECTION_ERROR: 44,
        DATA_DECODE_ERROR: 45,
        INACTIVITY_TIMEOUT: 46,
        UNKNOWN_TRANSPORT_SESSION_ID: 47,
        AD_MESSAGING_NOT_SUPPORTED: 48,
        CREATE_WEBSOCKET_FAILED: 49,
        REPLICATION_IS_STANDBY: 50
    };
    a.TransportSessionEventCode = {
        UP_NOTICE: 1,
        DESTROYED_NOTICE: 2,
        CONNECTING: 3,
        CAN_ACCEPT_DATA: 4,
        DATA_DECODE_ERROR: 5,
        PARSE_FAILURE: 6,
        CONNECTION_ERROR: 7,
        NOTIFY_GOT_TOKEN: 8
    };
    a.SessionEventCode = {
        UP_NOTICE: 1,
        DOWN_ERROR: 2,
        CONNECT_FAILED_ERROR: 3,
        CONNECTING: 4,
        REJECTED_MESSAGE_ERROR: 5,
        SUBSCRIPTION_ERROR: 6,
        SUBSCRIPTION_OK: 7,
        VIRTUALROUTER_NAME_CHANGED: 8,
        REQUEST_ABORTED: 9,
        REQUEST_TIMEOUT: 10,
        PROPERTY_UPDATE_OK: 11,
        PROPERTY_UPDATE_ERROR: 12,
        REAPPLY_SUBSCRIPTION_ERROR: 13,
        CAN_ACCEPT_DATA: 14,
        DISCONNECTED: 15,
        LOGIN_FAILURE: 16,
        P2P_SUB_ERROR: 17,
        PARSE_FAILURE: 18,
        DATA_DECODE_ERROR: 19,
        KEEP_ALIVE_ERROR: 20,
        INTERNAL_ERROR: 21
    };
    a.SessionEventCodeDescription = function() {
        var b = [],
            k;
        for (k in a.SessionEventCode)
            if (a.SessionEventCode.hasOwnProperty(k)) b[a.SessionEventCode[k]] = k;
        return b
    }();
    a.InternalSessionStateDescription = function() {
        var b = [];
        b[0] = "NEW";
        b[1] = "DISCONNECTED";
        b[2] = "WAITING_FOR_TRANSPORT_UP";
        b[3] = "TRANSPORT_SESSION_UP";
        b[4] = "WAITING_FOR_LOGIN";
        b[5] = "LOGIN_COMPLETE";
        b[6] = "WAITING_FOR_P2PINBOX_REG";
        b[7] = "P2PINBOX_REG_COMPLETE";
        b[8] = "CONNECTED";
        b[9] = "SESSION_ERROR";
        b[10] = "DISCONNECTING";
        b[11] = "REAPPLYING_SUBSCRIPTIONS";
        return b
    }();
    a.SessionOperationDescription = function() {
        var b = [];
        b[0] = "CONNECT";
        b[1] = "DISCONNECT";
        b[2] = "LOGIN";
        b[3] = "P2PINBOXREG";
        b[4] = "CTRL";
        b[5] = "SEND";
        b[6] = "REAPPLY_SUBSCRIPTIONS";
        b[7] = "QUERY_OPERATION";
        return b
    }();
    a.SessionState = {
        NEW: 0,
        CONNECTING: 1,
        CONNECTED: 2,
        SESSION_ERROR: 3,
        DISCONNECTING: 4,
        DISCONNECTED: 5
    };
    a.TransportProtocol = {
        HTTP_BASE64: "HTTP_BASE64",
        HTTP_BINARY: "HTTP_BINARY",
        HTTP_BINARY_STREAMING: "HTTP_BINARY_STREAMING",
        WS_BINARY: "WS_BINARY"
    };
    a.TransportFamily = {
        HTTP: "HTTP",
        HTTPS: "HTTPS",
        WS: "WS",
        WSS: "WSS"
    };
    a.NotImplementedError = function(b) {
        this.name = "NotImplementedError";
        this.message = b || ""
    };
    a.NotImplementedError.prototype = Error();
    a.NotImplementedError.prototype.toString = function() {
        var b = new a.StringBuffer(this.name);
        b.append(": ");
        b.append("message=").append(this.message || "");
        return b.toString()
    };
    a.OperationError = function(b, k, j) {
        this.name = "OperationError";
        this.message = b || "";
        this.subcode = k;
        this.reason = j
    };
    a.OperationError.prototype = Error();
    a.OperationError.prototype.toString = function() {
        var b = new a.StringBuffer;
        b.append(this.name).append(": ");
        if (this.name === "OperationError") {
            b.append("message=").append(this.message || "").append(", ");
            b.append("subcode=").append(this.subcode || "").append(", ");
            b.append("reason=").append(this.reason || "")
        } else b.append("message=").append(this.message || "");
        return b.toString()
    };
    a.TransportError = function(b, k) {
        this.name = "TransportError";
        this.message = b || "";
        this.subcode = k
    };
    a.TransportError.prototype = Error();
    a.TransportError.prototype.toString = function() {
        var b = new a.StringBuffer(this.name);
        b.append(": ");
        if (this.name === "TransportError") {
            b.append("message=").append(this.message || "").append(", ");
            b.append("subcode=").append(this.subcode || "")
        } else b.append("message=").append(this.message || "");
        return b.toString()
    };
    a.SessionProperties = function() {
        this.virtualRouterName = this.vpnNameInUse =
            this.vpnName = this.applicationDescription = this.clientName = this.userName = this.password = this.url = "";
        this.connectTimeoutInMsecs = 3E4;
        this.readTimeoutInMsecs = 1E4;
        this.sendBufferMaxSize = 65536;
        this.maxWebPayload = 1048576;
        this.bufferedAmountQueryIntervalInMsecs = 100;
        this.includeSenderId = this.generateReceiveTimestamps = this.generateSendTimestamps = false;
        this.keepAliveIntervalInMsecs = 3E3;
        this.keepAliveIntervalsLimit = 3;
        this.userIdentification = this.p2pInboxBase = this.p2pInboxInUse = "";
        this.generateSequenceNumber = false;
        this.subscriberNetworkPriority = this.subscriberLocalPriority = 1;
        this.ignoreSubscriptionNotFoundError = this.ignoreDuplicateSubscriptionError = true;
        this.noLocal = this.reapplySubscriptions = false;
        this.transportProtocolInUse = this.transportProtocol = null;
        this.transportDowngradeTimeoutInMsecs = 1E4;
        this.transportContentType = "text/plain"
    };
    a.SessionProperties.prototype.toString = function() {
        var b = new a.StringBuffer("\n"),
            k = true,
            j;
        for (j in this)
            if (this.hasOwnProperty(j))
                if (j !== "password")
                    if (k) {
                        b.append(" {").append(j).append(", ").append(this[j]).append("}");
                        k = false
                    } else b.append(",\n ").append("{").append(j).append(", ").append(this[j]).append(" }");
        return b.toString()
    };
    a.SessionProperties.prototype.clone = function() {
        var b = new a.SessionProperties,
            k;
        for (k in this)
            if (this.hasOwnProperty(k)) b[k] = this[k];
        return b
    };
    a.SessionProperties.prototype.sol_validate = function() {
        function b(h) {
            return typeof d[h] !== "undefined" && d[h] !== null && (typeof d[h] !== "string" || d[h].length > 0)
        }

        function k(h) {
            if (typeof d[h] === "undefined" || d[h] === null || d[h] === "") throw new a.OperationError("SessionProperties validation: Property '" +
                h + "' cannot be empty.", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        }

        function j(h, e) {
            if (b(h) && typeof d[h] === "string" && d[h].length > e) throw new a.OperationError("SessionProperties validation: Property '" + h + "' exceeded max length " + e, a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        }

        function n(h, e, i) {
            if (b(h) && typeof d[h] === "number" && (d[h] < e || d[h] > i)) throw new a.OperationError("SessionProperties validation: Property '" + h + "' out of range [" + e + "; " + i + "].", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        }

        function p(h, e) {
            if (b(h) &&
                typeof d[h] !== e) throw new a.OperationError("SessionProperties validation: Property '" + h + "' should be type " + e, a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        }

        function r(h) {
            for (var e = 1, i = arguments.length; e < i; e++) {
                var l = arguments[e];
                switch (l.length) {
                    case 1:
                        l[0](h);
                        break;
                    case 2:
                        l[0](h, l[1]);
                        break;
                    case 3:
                        l[0](h, l[1], l[2])
                }
            }
        }
        var d = this;
        r("url", [k], [p, "string"]);
        r("userName", [k], [p, "string"], [j, 32]);
        r("password", [p, "string"], [j, 128]);
        r("clientName", [p, "string"], [j, 160], [function(h) {
            if (b(h) && typeof d[h] === "string") {
                var e =
                    a.smf.ClientCtrlMessage.validateClientName(d[h]);
                if (e) throw new a.OperationError("SessionProperties validation: Property '" + h + "' :" + e, a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            }
        }]);
        r("applicationDescription", [p, "string"], [j, 254]);
        r("vpnName", [p, "string"], [j, 32]);
        r("connectTimeoutInMsecs", [p, "number"], [n, 1, Number.MAX_VALUE]);
        r("readTimeoutInMsecs", [p, "number"], [n, 1, Number.MAX_VALUE]);
        r("sendBufferMaxSize", [p, "number"], [n, 1, Number.MAX_VALUE]);
        r("maxWebPayload", [p, "number"], [n, 100, Number.MAX_VALUE]);
        r("bufferedAmountQueryIntervalInMsecs",
            [p, "number"], [n, 4, Number.MAX_VALUE]);
        r("generateSendTimestamps", [p, "boolean"]);
        r("generateReceiveTimestamps", [p, "boolean"]);
        r("includeSenderId", [p, "boolean"]);
        r("keepAliveIntervalInMsecs", [p, "number"], [n, 100, Number.MAX_VALUE]);
        r("keepAliveIntervalsLimit", [p, "number"], [n, 3, Number.MAX_VALUE]);
        r("generateSequenceNumber", [p, "boolean"]);
        r("subscriberLocalPriority", [p, "number"], [n, 1, 4]);
        r("subscriberNetworkPriority", [p, "number"], [n, 1, 4]);
        r("ignoreDuplicateSubscriptionError", [p, "boolean"]);
        r("ignoreSubscriptionNotFoundError",
            [p, "boolean"]);
        r("reapplySubscriptions", [p, "boolean"]);
        r("noLocal", [p, "boolean"]);
        r("transportProtocol", [function(h, e, i) {
            var l = d[h];
            if (a.EnumUtil.name(a[e], l) === null && !(i && l === null)) throw new a.OperationError("SessionProperties validation: Property '" + h + "' must be a member of solace." + e);
        }, "TransportProtocol", true]);
        r("transportDowngradeTimeoutInMsecs", [p, "number"], [n, 1, Number.MAX_VALUE])
    };
    a.MessageRxCBInfo = function(b, k) {
        this.messageRxCBFunction = b;
        this.userObject = k
    };
    a.SessionEventCBInfo = function(b,
        k) {
        this.userObject = k;
        this.sessionEventCBFunction = b
    };
    a.SessionEvent = function(b, k, j, n, p, r) {
        this.sessionEventCode = b;
        this.infoStr = k;
        this.responseCode = j;
        this.errorSubCode = n;
        this.correlationKey = p;
        this.reason = r
    };
    a.SessionEvent.prototype.toString = function() {
        var b = new a.StringBuffer("Session event: ");
        b.append("sessionEventCode=").append(a.SessionEventCodeDescription[this.sessionEventCode]).append(", ");
        b.append("infoStr=").append(this.infoStr || "").append(", ");
        b.append("responseCode=").append(this.responseCode ||
            "").append(", ");
        b.append("errorSubCode=").append(this.errorSubCode || "").append(", ");
        b.append("correlationKey=").append(this.correlationKey || "").append(", ");
        b.append("reason=(").append(this.reason || "").append(")");
        return b.toString()
    };
    a.DestinationType = {
        TOPIC: 0
    };
    a.DestinationTypeDescription = function() {
        var b = [],
            k;
        for (k in a.DestinationType)
            if (a.DestinationType.hasOwnProperty(k)) b[a.DestinationType[k]] = k;
        return b
    }();
    a.Destination = function(b) {
        this.m_name = b;
        this.m_type = a.DestinationType.TOPIC;
        this.m_temporary =
            false
    };
    a.Destination.prototype.isTemporary = function() {
        return this.m_temporary
    };
    a.Destination.prototype.getType = function() {
        return this.m_type
    };
    a.Destination.prototype.getName = function() {
        return this.m_name
    };
    a.Destination.prototype.toString = function() {
        return this.getName() || "[object Destination]"
    };
    a.Topic = function(b) {
        this.m_name = b;
        this.m_type = a.DestinationType.TOPIC;
        this.m_temporary = false
    };
    a.Topic.prototype = new a.Destination;
    a.Topic.prototype.getKey = function() {
        return this.m_name
    };
    a.MessageCacheStatus = {
        LIVE: 0,
        CACHED: 1,
        SUSPECT: 2
    };
    a.Message = function() {
        this.m_binaryMetaChunk = this.m_userData = this.m_xmlMetadata = this.m_xmlContent = this.m_binaryAttachment = null;
        this.m_redelivered = this.m_elidingEligible = this.m_discardIndication = false;
        this.m_deliveryMode = a.MessageDeliveryModeType.DIRECT;
        this.m_deliverToOne = false;
        this.m_destination = null;
        this.m_userCos = a.MessageUserCosType.COS1;
        this.m_correlationId = this.m_applicationMessageType = this.m_applicationMessageId = null;
        this.m_replyMessage = false;
        this.m_senderTimestamp =
            this.m_senderId = this.m_replyTo = null;
        this.m_autoSenderTimestamp = false;
        this.m_sequenceNumber = null;
        this.m_autoSequenceNumber = false;
        this.m_receiverTimestamp = this.m_structuredContainer = this.m_userPropertyMap = null;
        this.m_messageType = a.MessageType.BINARY;
        this.m_cacheStatus = a.MessageCacheStatus.LIVE;
        this.m_smfHeader = this.m_cacheRequestId = null
    };
    a.Message.prototype.getType = function() {
        return this.m_messageType
    };
    a.Message.prototype.setApplicationMessageId = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.",
            a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_applicationMessageId = b
    };
    a.Message.prototype.getApplicationMessageId = function() {
        return this.m_applicationMessageId
    };
    a.Message.prototype.setApplicationMessageType = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_applicationMessageType = b
    };
    a.Message.prototype.getApplicationMessageType = function() {
        return this.m_applicationMessageType
    };
    a.Message.prototype.getBinaryAttachment =
        function() {
            return this.m_binaryAttachment
        };
    a.Message.prototype.setBinaryAttachment = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_binaryAttachment = b
    };
    a.Message.prototype.getCacheRequestId = function() {
        return this.m_cacheRequestId
    };
    a.Message.prototype.setCacheRequestID = function(b) {
        this.m_cacheRequestId = b
    };
    a.Message.prototype.getCorrelationId = function() {
        return this.m_correlationId
    };
    a.Message.prototype.setCorrelationId =
        function(b) {
            if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
            this.m_correlationId = b
        };
    a.Message.prototype.setDeliverToOne = function(b) {
        this.m_deliverToOne = b
    };
    a.Message.prototype.isDeliverToOne = function() {
        return this.m_deliverToOne
    };
    a.Message.prototype.getDeliveryMode = function() {
        return this.m_deliveryMode
    };
    a.Message.prototype.setDeliveryMode = function(b) {
        this.m_deliveryMode = b
    };
    a.Message.prototype.getDestination =
        function() {
            return this.m_destination
        };
    a.Message.prototype.setDestination = function(b) {
        this.m_destination = b
    };
    a.Message.prototype.isDiscardIndication = function() {
        return this.m_discardIndication
    };
    a.Message.prototype.setDiscardIndication = function(b) {
        this.m_discardIndication = b
    };
    a.Message.prototype.isElidingEligible = function() {
        return this.m_elidingEligible
    };
    a.Message.prototype.setElidingEligible = function(b) {
        this.m_elidingEligible = b
    };
    a.Message.prototype.getCacheStatus = function() {
        return this.m_cacheStatus
    };
    a.Message.prototype.setCacheStatus = function(b) {
        this.m_cacheStatus = b
    };
    a.Message.prototype.isReplyMessage = function() {
        return this.m_replyMessage
    };
    a.Message.prototype.isRedelivered = function() {
        return this.m_redelivered
    };
    a.Message.prototype.setAsReplyMessage = function(b) {
        this.m_replyMessage = b
    };
    a.Message.prototype.getReceiverTimestamp = function() {
        return this.m_receiverTimestamp
    };
    a.Message.prototype.getReplyTo = function() {
        return this.m_replyTo
    };
    a.Message.prototype.setReplyTo = function(b) {
        this.m_replyTo = b
    };
    a.Message.prototype.getSenderId =
        function() {
            return this.m_senderId
        };
    a.Message.prototype.setSenderId = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_senderId = b
    };
    a.Message.prototype.getSenderTimestamp = function() {
        return this.m_senderTimestamp
    };
    a.Message.prototype.setSenderTimestamp = function(b) {
        this.m_senderTimestamp = b
    };
    a.Message.prototype.getSequenceNumber = function() {
        return this.m_sequenceNumber
    };
    a.Message.prototype.setSequenceNumber =
        function(b) {
            this.m_sequenceNumber = b;
            this.m_autoSequenceNumber = false
        };
    a.Message.prototype.getUserCos = function() {
        return this.m_userCos
    };
    a.Message.prototype.setUserCos = function(b) {
        this.m_userCos = b
    };
    a.Message.prototype.getUserData = function() {
        return this.m_userData
    };
    a.Message.prototype.setUserData = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_userData = b
    };
    a.Message.prototype.getXmlContent =
        function() {
            return this.m_xmlContent
        };
    a.Message.prototype.setXmlContent = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_xmlContent = b
    };
    a.Message.prototype.setXmlMetadata = function(b) {
        if (b !== null && typeof b !== "string") throw new a.OperationError("Invalid message parameter, expected string.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        this.m_xmlMetadata = b
    };
    a.Message.prototype.getXmlMetadata = function() {
        return this.m_xmlMetadata
    };
    a.Message.prototype.getBinaryMetadataChunk = function() {
        return this.m_binaryMetaChunk
    };
    a.Message.prototype.setBinaryMetadataChunk = function(b) {
        this.m_binaryMetaChunk = b
    };
    a.Message.prototype.getSmfHeader = function() {
        return this.m_smfHeader
    };
    a.Message.prototype.setHasAutoSequenceNumber = function(b) {
        this.m_autoSequenceNumber = b
    };
    a.Message.prototype.hasAutoSequenceNumber = function() {
        return this.m_autoSequenceNumber
    };
    a.Message.prototype.setHasAutoSenderTimestamp = function(b) {
        this.m_autoSenderTimestamp = b
    };
    a.Message.prototype.hasAutoSenderTimestamp =
        function() {
            return this.m_autoSenderTimestamp
        };
    a.Message.prototype.getUserPropertyMap = function() {
        return this.m_userPropertyMap
    };
    a.Message.prototype.setUserPropertyMap = function(b) {
        this.m_userPropertyMap = b
    };
    a.Message.prototype.setSdtContainer = function(b) {
        if (b === null) {
            this.m_structuredContainer = null;
            this.m_messageType = a.MessageType.BINARY;
            this.setBinaryAttachment(null)
        } else {
            a.Util.checkParamInstanceOf(b, a.SDTField, "solace.SDTField");
            switch (b.getType()) {
                case a.SDTFieldType.MAP:
                    this.m_messageType = a.MessageType.MAP;
                    break;
                case a.SDTFieldType.STREAM:
                    this.m_messageType = a.MessageType.STREAM;
                    break;
                case a.SDTFieldType.STRING:
                    this.m_messageType = a.MessageType.TEXT;
                    break;
                default:
                    throw new a.OperationError("Invalid parameter, SDTField Type of MAP, STREAM, or STRING.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
            }
            this.m_structuredContainer = b
        }
    };
    a.Message.prototype.getSdtContainer = function() {
        var b = this.getType();
        if ((b === a.MessageType.MAP || b === a.MessageType.STREAM || b === a.MessageType.TEXT) && this.getBinaryAttachment() !== null && this.getBinaryAttachment().length >
            0) {
            b = null;
            if (!(b = a.sdt.Codec.parseSdt(this.getBinaryAttachment(), 0))) return null;
            return this.m_structuredContainer = b
        }
        return null
    };
    a.Message.prototype.dump = function(b) {
        if (typeof b === "undefined") return a.MessageDumpUtil.dump(this, a.MessageDumpFlag.MSGDUMP_FULL);
        else if (typeof b !== "undefined" && b !== null && typeof b === "number")
            if (b === a.MessageDumpFlag.MSGDUMP_BRIEF || b === a.MessageDumpFlag.MSGDUMP_FULL) return a.MessageDumpUtil.dump(this, b);
            else throw new a.OperationError("Invalid parameter value for dump flags.",
                a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        else throw new a.OperationError("Invalid parameter type for dump flags.", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
    };
    a.MessageUserCosType = {
        COS1: 0,
        COS2: 1,
        COS3: 2
    };
    a.MessageUserCosTypeDescription = function() {
        var b = [];
        b[a.MessageUserCosType.COS1] = "COS1";
        b[a.MessageUserCosType.COS2] = "COS2";
        b[a.MessageUserCosType.COS3] = "COS3";
        return b
    }();
    a.MessageType = {
        BINARY: 0,
        MAP: 1,
        STREAM: 2,
        TEXT: 3
    };
    a.MessageTypeDescription = function() {
        var b = [];
        b[a.MessageType.BINARY] = "Binary";
        b[a.MessageType.MAP] =
            "Map";
        b[a.MessageType.STREAM] = "Stream";
        b[a.MessageType.TEXT] = "Text";
        return b
    }();
    a.MessageDeliveryModeType = {
        DIRECT: 0,
        PERSISTENT: 1,
        NON_PERSISTENT: 2
    };
    a.MessageDeliveryModeTypeDescription = function() {
        var b = [];
        b[a.MessageDeliveryModeType.DIRECT] = "DIRECT";
        b[a.MessageDeliveryModeType.PERSISTENT] = "PERSISTENT";
        b[a.MessageDeliveryModeType.NON_PERSISTENT] = "NON_PERSISTENT";
        return b
    }();
    a.MutableSessionProperty = {
        CLIENT_NAME: 1,
        CLIENT_DESCRIPTION: 2
    };
    a.MessageDumpFlag = {
        MSGDUMP_BRIEF: 0,
        MSGDUMP_FULL: 1
    };
    a.StatType = {
        TX_TOTAL_DATA_BYTES: 0,
        TX_TOTAL_DATA_MSGS: 1,
        TX_DIRECT_BYTES: 2,
        TX_DIRECT_MSGS: 3,
        TX_CONTROL_BYTES: 4,
        TX_CONTROL_MSGS: 5,
        TX_REQUEST_SENT: 6,
        TX_REQUEST_TIMEOUT: 7,
        RX_TOTAL_DATA_BYTES: 8,
        RX_TOTAL_DATA_MSGS: 9,
        RX_DIRECT_BYTES: 10,
        RX_DIRECT_MSGS: 11,
        RX_CONTROL_BYTES: 12,
        RX_CONTROL_MSGS: 13,
        RX_DISCARD_MSG_INDICATION: 14,
        RX_REPLY_MSG_RECVED: 15,
        RX_REPLY_MSG_DISCARD: 16,
        RX_DISCARD_SMF_UNKNOWN_ELEMENT: 17,
        CACHE_REQUEST_SENT: 18,
        CACHE_REQUEST_OK_RESPONSE: 19,
        CACHE_REQUEST_FAIL_RESPONSE: 20,
        CACHE_REQUEST_FULFILL_DISCARD_RESPONSE: 21,
        RX_CACHE_MSG: 22,
        CACHE_REQUEST_INCOMPLETE_RESPONSE: 23,
        CACHE_REQUEST_LIVE_DATA_FULFILL: 24
    };
    a.SessionStatistics = function() {
        this.m_statsMap = [];
        for (var b in a.StatType)
            if (a.StatType.hasOwnProperty(b)) this.m_statsMap[a.StatType[b]] = 0
    };
    a.SessionStatistics.prototype.resetStats = function() {
        for (var b = 0, k = this.m_statsMap.length; b < k; b++)
            if (typeof this.m_statsMap[b] !== "undefined") this.m_statsMap[b] = 0
    };
    a.SessionStatistics.prototype.incStat = function(b, k) {
        this.m_statsMap[b] += k !== undefined ? k : 1
    };
    a.SessionStatistics.prototype.getStat =
        function(b) {
            return this.m_statsMap[b]
        };
    a.CapabilityType = {
        PEER_SOFTWARE_VERSION: 0,
        PEER_SOFTWARE_DATE: 1,
        PEER_PLATFORM: 2,
        PEER_PORT_SPEED: 3,
        PEER_PORT_TYPE: 4,
        MAX_DIRECT_MSG_SIZE: 5,
        PEER_ROUTER_NAME: 6,
        MESSAGE_ELIDING: 7,
        NO_LOCAL: 8
    };
    a.CapabilityTypeDescription = function() {
        var b = [];
        b[a.CapabilityType.PEER_SOFTWARE_VERSION] = "PEER_SOFTWARE_VERSION";
        b[a.CapabilityType.PEER_SOFTWARE_DATE] = "PEER_SOFTWARE_DATE";
        b[a.CapabilityType.PEER_PLATFORM] = "PEER_PLATFORM";
        b[a.CapabilityType.PEER_PORT_SPEED] = "PEER_PORT_SPEED";
        b[a.CapabilityType.PEER_PORT_TYPE] = "PEER_PORT_TYPE";
        b[a.CapabilityType.MAX_DIRECT_MSG_SIZE] = "MAX_DIRECT_MSG_SIZE";
        b[a.CapabilityType.PEER_ROUTER_NAME] = "PEER_ROUTER_NAME";
        b[a.CapabilityType.MESSAGE_ELIDING] = "MESSAGE_ELIDING";
        b[a.CapabilityType.NO_LOCAL] = "NO_LOCAL";
        return b
    }();
    a.LogLevel = {
        FATAL: 0,
        ERROR: 1,
        WARN: 2,
        INFO: 3,
        DEBUG: 4,
        TRACE: 5
    };
    a.SolclientFactoryProperties = function() {
        this.logLevel = a.LogLevel.ERROR;
        this.logger = null
    };
    a.LogImpl = function(b, k, j, n, p, r) {
        this.trace = b;
        this.debug = k;
        this.info = j;
        this.warn =
            n;
        this.error = p;
        this.fatal = r
    };
    a.ConsoleLogImpl = function() {
        var b = function() {},
            k = b,
            j = b,
            n = b,
            p = b,
            r = b,
            d = b;
        if (g) {
            k = !!Function.prototype.bind;
            j = typeof g.log === "object";
            r = k ? Function.prototype.bind : function(h) {
                var e = Array.prototype.slice.call(arguments, 1),
                    i = this,
                    l = function() {},
                    c = function() {
                        return i.apply(this instanceof Function && h ? this : h, e.concat(Array.prototype.slice.call(arguments)))
                    };
                l.prototype = this.prototype;
                c.prototype = new l;
                return c
            };
            if (!k && j) d = r = p = n = j = k = b = function() {
                Function.prototype.call.call(g.log,
                    g, Array.prototype.slice.call(arguments))
            };
            else {
                k = j = g.log && typeof g.log !== "undefined" ? r.call(g.log, g) : g.debug && typeof g.debug === "function" ? r.call(g.debug, g) : b;
                n = g.info && typeof g.info !== "undefined" ? r.call(g.info, g) : j;
                p = g.warn && typeof g.warn !== "undefined" ? r.call(g.warn, g) : n;
                d = r = g.error && typeof g.error !== "undefined" ? r.call(g.error, g) : p
            }
        }
        a.LogImpl.call(this, k, j, n, p, r, d)
    };
    a.ConsoleLogImpl.prototype = Object.create ? Object.create(a.LogImpl) : new a.LogImpl;
    a.SolclientFactory = function() {
        var b = 0,
            k = a.LogLevel.ERROR,
            j = new a.ConsoleLogImpl;
        return {
            createSession: function(n, p, r) {
                return new a.Session(n, p, r)
            },
            createTopic: function(n) {
                return new a.Topic(n)
            },
            init: function(n) {
                if (b === 0) {
                    if (typeof n !== "undefined" && n !== null && n instanceof a.SolclientFactoryProperties) {
                        if (n.logLevel < a.LogLevel.FATAL || n.logLevel > a.LogLevel.TRACE) throw new a.OperationError("Invalid log level", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE, null);
                        k = n.logLevel
                    }
                    a.logger = n.logger || new a.ConsoleLogImpl;
                    if (!(j && j.trace && typeof j.trace === "function" && j.debug &&
                            typeof j.debug === "function" && j.info && typeof j.info === "function" && j.warn && typeof j.warn === "function" && j.error && typeof j.error === "function" && j.fatal && typeof j.fatal === "function")) throw new a.OperationError("Invalid logger (trace, debug, info, warn, error and fatal methods required)", a.ErrorSubcode.PARAMETER_INVALID_TYPE, null);
                    b++
                }
            },
            getLogLevel: function() {
                return k
            },
            setLogLevel: function(n) {
                if (n < a.LogLevel.FATAL || n > a.LogLevel.TRACE) throw new a.OperationError("Invalid log level", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE,
                    null);
                k = n
            },
            createMessage: function() {
                return new a.Message
            }
        }
    }();
    a.P2PUtil = {
        getP2PInboxTopic: function(b) {
            return b + "/#"
        },
        getP2PTopicSubscription: function(b) {
            return b + "/>"
        }
    };
    a.GlobalContext = function() {
        function b(k, j) {
            for (var n = j - k.length; n > 0; n--) k = "0" + k;
            return k
        }
        return {
            RandId: function() {
                var k = (Math.random() * Math.pow(2, 32)).toFixed(0);
                return b(k + "", 10)
            }(),
            sessionCounter: 0,
            NextSessionCounter: function() {
                this.sessionCounter++;
                return b(this.sessionCounter + "", 4)
            },
            idCounter: 0,
            NextId: function() {
                this.idCounter++;
                return this.idCounter
            },
            GenerateClientName: function() {
                var k = "solclientjs",
                    j = "";
                if (typeof navigator.product !== "undefined") {
                    k = a.TopicUtil.toSafeChars(navigator.product);
                    k = k.length > 0 ? k : "solclientjs"
                }
                j = a.TopicUtil.toSafeChars(navigator.platform);
                return j = k + "/" + j + "/" + this.RandId + "/" + this.NextSessionCounter()
            },
            GenerateUserIdentification: function() {
                var k = "solclientjs",
                    j = "";
                if (typeof navigator.product !== "undefined") {
                    k = a.TopicUtil.toSafeChars(navigator.product);
                    k = k.length > 0 ? k : "solclientjs"
                }
                j = a.TopicUtil.toSafeChars(navigator.platform);
                return j = k + "/" + j + "/" + this.RandId
            },
            GenerateClientDescription: function() {
                var k = "solclientjs / " + navigator.userAgent;
                if (k.length > 254) k = k.substr(0, 254);
                return k
            }
        }
    }();
    a.Util = function() {
        return {
            checkParamTypeOf: function(b, k, j) {
                if (typeof b !== k) throw new a.OperationError("Invalid parameter type for " + (j || "") + ", expected a " + k, a.ErrorSubcode.PARAMETER_INVALID_TYPE);
            },
            checkParamInstanceOf: function(b, k, j) {
                if (!(b instanceof k)) throw new a.OperationError("Invalid parameter, expected a " + j, a.ErrorSubcode.PARAMETER_INVALID_TYPE);
            },
            nullTerminate: function(b) {
                return b.charCodeAt(b.length - 1) === 0 ? b : b + String.fromCharCode(0)
            },
            stripNullTerminate: function(b) {
                return b.charCodeAt(b.length - 1) === 0 ? b.substr(0, b.length - 1) : b
            },
            hexdump: function(b) {
                for (var k = [], j = [], n = 0, p = function() {
                        for (var l = [], c = 0; c < 256; c++) l[c] = c < 33 || c > 126 ? "." : String.fromCharCode(c);
                        return l
                    }(), r = function(l) {
                        return l === 8 || l === 16 ? "  " : " "
                    }, d = function(l, c) {
                        for (; l.length < c; l = " " + l);
                        return l
                    }, h = 0, e = b.length; h < e; h++) {
                    var i = b.charCodeAt(h);
                    k.push(d(i.toString(16), 2));
                    j.push(p[i] ||
                        ".");
                    n++;
                    k.push(r(n));
                    if (h === b.length - 1)
                        for (; n < 16;) k.push("  " + r(++n));
                    if (n === 16) {
                        k.push(j.join(""));
                        k.push("\n");
                        n = 0;
                        j = []
                    }
                }
                return k.join("")
            },
            debugParseSmfStream: function(b) {
                for (var k = 0; k < b.length;) {
                    var j = a.smf.Codec.decodeCompoundMessage(b, k);
                    if (j && j.getSmfHeader()) {
                        j = j.getSmfHeader();
                        k += j.m_messageLength
                    } else break
                }
            },
            TimingBucket: function(b, k) {
                this.name = b;
                this.buckets = [];
                this.log = function(j) {
                    if (!(typeof j === "undefined" || isNaN(j))) {
                        j = Math.floor(j / k) * k;
                        this.buckets[j] = this.buckets[j] || 0;
                        this.buckets[j]++
                    }
                };
                this.bucketCount = function() {
                    for (var j = 0, n = 0; n < this.buckets.length; n++) j += this.buckets[n] || 0;
                    return j
                };
                this.toString = function() {
                    var j = [],
                        n;
                    for (n in this.buckets) this.buckets.hasOwnProperty(n) && j.push(n + ": " + this.buckets[n]);
                    return "{" + j.join(", ") + "}"
                }
            },
            each: function(b, k) {
                var j;
                if (typeof(j = b.length) === "undefined")
                    for (var n in b) {
                        if (b.hasOwnProperty(n))
                            if (k(b[n], n) === false) break
                    } else
                        for (n = 0; n < j; n++)
                            if (k(b[n], n) === false) break
            },
            formatHexString: function(b) {
                function k(p) {
                    if (typeof p !== "number") return "";
                    p = p.toString(16);
                    return p.length < 2 ? "0" + p : p
                }
                var j = "";
                if (typeof b === "number") return k(b);
                else if (typeof b === "object" && b instanceof Array) {
                    for (var n = 0; n < b.length; n++) j += k(b[n]);
                    return j
                } else if (typeof b === "string") {
                    for (n = 0; n < b.length; n++) j += k(b.charCodeAt(n));
                    return j
                } else return null
            },
            strFmt: function(b) {
                var k = 1,
                    j = arguments;
                return b.replace(/\{\d+\}/g, function(n) {
                    var p = j[k++];
                    return typeof p === "undefined" ? n : p + ""
                })
            }
        }
    }();
    a.MessageDumpStandardProvider = function() {
        return {
            fpDestination: function(b) {
                b = b.getDestination();
                return b !== null && b instanceof a.Destination ? ["Destination", true, a.DestinationTypeDescription[b.getType()] + " '" + b.getName() + "'", null] : ["Destination", false, "", null]
            },
            fpSenderId: function(b) {
                return ["SenderId", typeof b.getSenderId() !== "undefined" && b.getSenderId() !== null, b.getSenderId(), null]
            },
            fpAppMsgType: function(b) {
                return ["AppMessageType", typeof b.getApplicationMessageType() !== "undefined" && b.getApplicationMessageType() !== null, b.getApplicationMessageType(), null]
            },
            fpAppMsgId: function(b) {
                return ["AppMessageID",
                    typeof b.getApplicationMessageId() !== "undefined" && b.getApplicationMessageId() !== null, b.getApplicationMessageId(), null
                ]
            },
            fpSequenceNumber: function(b) {
                b = b.getSequenceNumber();
                return typeof b === "number" ? ["SequenceNumber", true, b, null] : ["SequenceNumber", false, "", null]
            },
            fpCorrelationId: function(b) {
                return ["CorrelationId", typeof b.getCorrelationId() !== "undefined" && b.getCorrelationId() !== null, b.getCorrelationId(), null]
            },
            fpSendTimestamp: function(b) {
                b = b.getSenderTimestamp();
                return typeof b === "number" ? ["SendTimestamp",
                    true, b + " (" + a.MessageDumpUtil.formatDate(b) + ")", null
                ] : ["SendTimestamp", false, "", null]
            },
            fpRcvTimestamp: function(b) {
                b = b.getReceiverTimestamp();
                return typeof b === "number" ? ["RcvTimestamp", true, b + " (" + a.MessageDumpUtil.formatDate(b) + ")", null] : ["RcvTimestamp", false, "", null]
            },
            fpClassOfService: function(b) {
                return typeof b.getUserCos() === "number" ? ["Class Of Service", true, a.MessageUserCosTypeDescription[b.getUserCos()], null] : ["Class Of Service", false, "", null]
            },
            fpDeliveryMode: function(b) {
                return typeof b.getDeliveryMode() ===
                    "number" ? ["DeliveryMode", true, a.MessageDeliveryModeTypeDescription[b.getDeliveryMode()], null] : ["DeliveryMode", false, "", null]
            },
            fpMessageRedelivered: function(b) {
                return ["Message Re-delivered", b.isRedelivered(), "", null]
            },
            fpDiscardIndication: function(b) {
                return ["Discard Indication", b.isDiscardIndication(), "", null]
            },
            fpReplyMessage: function(b) {
                return ["Reply Message", b.isReplyMessage(), "", null]
            },
            fpReplyTo: function(b) {
                b = b.getReplyTo();
                return b !== null && b instanceof a.Destination ? ["ReplyTo", true, a.DestinationTypeDescription[b.getType()] +
                    " '" + b.getName() + "'", null
                ] : ["ReplyTo", false, "", null]
            },
            fpDeliverToOne: function(b) {
                return ["Deliver To One", b.isDeliverToOne(), "", null]
            },
            fpElidingEligible: function(b) {
                return ["Eliding Eligible", b.isElidingEligible(), "", null]
            },
            fpUserData: function(b) {
                return a.StringUtil.notEmpty(b.getUserData()) ? ["User Data", true, "len=" + b.getUserData().length, a.StringUtil.formatDumpBytes(b.getUserData(), true, 2)] : ["User Data", false, "", null]
            },
            fpUserPropertyMap: function(b, k) {
                var j = b.getUserPropertyMap();
                if (j !== null && j instanceof a.SDTMapContainer) {
                    var n = j.getKeys().length + " entries",
                        p = null;
                    if (k === a.MessageDumpFlag.MSGDUMP_FULL) try {
                        p = a.MessageDumpUtil.printMap(j, 2)
                    } catch (r) {
                        p = "Error"
                    }
                    return ["User Property Map", true, n, p]
                } else return ["User Property Map", false, "", null]
            },
            fpSdtStream: function(b, k) {
                var j = b.getSdtContainer();
                if (j !== null && j.getType() === a.SDTFieldType.STREAM) {
                    var n = a.MessageDumpUtil.countItems(j.getValue()) + " entries",
                        p = null;
                    if (k === a.MessageDumpFlag.MSGDUMP_FULL) try {
                        p = a.MessageDumpUtil.printStream(j.getValue(), 2)
                    } catch (r) {
                        p =
                            "Error"
                    }
                    return ["SDT Stream", true, n, p]
                } else return ["SDT Stream", false, "", null]
            },
            fpSdtMap: function(b, k) {
                var j = b.getSdtContainer();
                if (j !== null && j.getType() === a.SDTFieldType.MAP) {
                    var n = j.getValue().getKeys().length + " entries",
                        p = null;
                    if (k === a.MessageDumpFlag.MSGDUMP_FULL) try {
                        p = a.MessageDumpUtil.printMap(j.getValue(), 2)
                    } catch (r) {
                        p = "Error"
                    }
                    return ["SDT Map", true, n, p]
                } else return ["SDT Map", false, "", null]
            },
            fpBinaryAttachment: function(b, k) {
                var j = b.getBinaryAttachment();
                if (a.StringUtil.notEmpty(j)) {
                    var n = "len=" +
                        j.length,
                        p = null;
                    if (k === a.MessageDumpFlag.MSGDUMP_FULL) p = a.StringUtil.formatDumpBytes(j, true, 2);
                    return ["Binary Attachment", true, n, p]
                } else return ["Binary Attachment", false, "", null]
            },
            fpXmlContent: function(b, k) {
                var j = b.getXmlContent();
                if (a.StringUtil.notEmpty(j)) {
                    var n = "len=" + j.length,
                        p = null;
                    if (k === a.MessageDumpFlag.MSGDUMP_FULL) p = a.StringUtil.formatDumpBytes(j, true, 2);
                    return ["XML", true, n, p]
                } else return ["XML", false, "", null]
            },
            fpXmlMetadata: function(b, k) {
                var j = b.getXmlMetadata();
                if (a.StringUtil.notEmpty(j)) {
                    var n =
                        "len=" + j.length,
                        p = null;
                    if (k === a.MessageDumpFlag.MSGDUMP_FULL) p = a.StringUtil.formatDumpBytes(j, true, 2);
                    return ["XML Metadata", true, n, p]
                } else return ["XML Metadata", false, "", null]
            }
        }
    }();
    a.MessageDumpUtil = function() {
        var b = a.MessageDumpStandardProvider,
            k = [],
            j;
        for (j in b) b.hasOwnProperty(j) && k.push(b[j]);
        return {
            getOutOfRangeValue: function(n) {
                return "<out of range>\n" + a.StringUtil.formatDumpBytes(n)
            },
            getValue: function(n) {
                var p = null;
                try {
                    return p = n.getValue()
                } catch (r) {
                    if (r instanceof a.SDTUnsupportedValueError)
                        if (r.getSubcode() ===
                            a.SDTValueErrorSubcode.VALUE_OUTSIDE_SUPPORTED_RANGE) return this.getOutOfRangeValue(r.getSourceData());
                    throw r;
                }
            },
            printMap: function(n, p) {
                if (typeof n === "undefined" || n === null || !(n instanceof a.SDTMapContainer)) return null;
                for (var r = new a.StringBuffer, d = a.StringUtil.padRight("", p, " "), h = n.getKeys().sort(), e = 0; e < h.length; e++) {
                    var i = h[e],
                        l = n.getField(i),
                        c = null,
                        f = null;
                    if (l.getType() !== null) c = l.getType();
                    f = this.getValue(l);
                    l = null;
                    switch (c) {
                        case a.SDTFieldType.MAP:
                            l = "\n";
                            l += this.printMap(f, p + 2);
                            break;
                        case a.SDTFieldType.STREAM:
                            l =
                                "\n";
                            l += this.printStream(f, p + 2);
                            break;
                        case a.SDTFieldType.BYTEARRAY:
                            l = a.StringUtil.formatDumpBytes(f, false, 0);
                            if (l !== null && l.charAt(l.length - 1) === "\n") l = l.substring(0, l.length - 1);
                            break;
                        case a.SDTFieldType.DESTINATION:
                            l = a.DestinationTypeDescription[f.getType()] + " '" + f.getName() + "'";
                            break;
                        default:
                            l = f !== null ? f.toString() : null
                    }
                    r.append(d);
                    r.append("Key '").append(i).append("' (").append(a.SDTFieldTypeDescription[c]).append("): ").append(l);
                    e < h.length - 1 && r.append("\n")
                }
                return r.toString()
            },
            printStream: function(n,
                p) {
                if (typeof n === "undefined" || n === null || !(n instanceof a.SDTStreamContainer)) return null;
                n.rewind();
                for (var r = new a.StringBuffer, d = a.StringUtil.padRight("", p, " "); n.hasNext();) {
                    var h = n.getNext(),
                        e = null,
                        i = null;
                    if (h.getType() !== null) e = h.getType();
                    i = this.getValue(h);
                    h = null;
                    switch (e) {
                        case a.SDTFieldType.MAP:
                            h = "\n";
                            h += this.printMap(i, p + 2);
                            break;
                        case a.SDTFieldType.STREAM:
                            h = "\n";
                            h += this.printStream(i, p + 2);
                            break;
                        case a.SDTFieldType.BYTEARRAY:
                            h = a.StringUtil.formatDumpBytes(i, false, 0);
                            if (h !== null && h.charAt(h.length -
                                    1) === "\n") h = h.substring(0, h.length - 1);
                            break;
                        case a.SDTFieldType.DESTINATION:
                            h = a.DestinationTypeDescription[i.getType()] + " '" + i.getName() + "'";
                            break;
                        default:
                            h = i !== null ? i.toString() : null
                    }
                    r.append(d);
                    r.append("(").append(a.SDTFieldTypeDescription[e]).append("): ").append(h);
                    n.hasNext() && r.append("\n")
                }
                n.rewind();
                return r.toString()
            },
            countItems: function(n) {
                if (typeof n === "undefined" || n === null || !(n instanceof a.SDTStreamContainer)) return 0;
                n.rewind();
                for (var p = 0; n.hasNext();) {
                    n.getNext();
                    p++
                }
                n.rewind();
                return p
            },
            formatDate: function(n) {
                return (new Date(n)).format("ddd mmm dd yyyy HH:MM:ss Z", true)
            },
            dump: function(n, p, r, d) {
                var h, e, i, l = new a.StringBuffer,
                    c = "\n",
                    f = 40;
                if (typeof r !== "undefined" && r !== null && typeof r === "string") c = r;
                if (typeof d !== "undefined" && d !== null && typeof d === "number") f = d;
                r = false;
                for (d = 0; d < k.length; d++) {
                    h = k[d](n, p);
                    if (e = h[1]) {
                        e = h[0];
                        i = h[2];
                        h = h[3];
                        r && l.append(c);
                        if (i === null || i.length === 0) l.append(e);
                        else {
                            l.append(a.StringUtil.padRight(e + ":", f, " "));
                            l.append(i)
                        }
                        if (h !== null && (p & a.MessageDumpFlag.MSGDUMP_FULL) >
                            0) {
                            l.append("\n");
                            h.indexOf("  ") !== 0 && l.append("  ");
                            l.append(h);
                            h.substring(h.length - 2) !== "\n" && d < k.length - 1 && l.append("\n")
                        }
                        r = true
                    }
                }
                return l.toString()
            }
        }
    }()
})(solace, detected_console);
(function(a) {
    function g() {
        var r = null;
        if (typeof window.XMLHttpRequest !== "undefined" && window.XMLHttpRequest) r = new XMLHttpRequest;
        else if (typeof window.ActiveXObject !== "undefined" && window.ActiveXObject)
            for (var d = ["Microsoft.XMLHttp", "MSXML2.XMLHttp", "MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0"], h = 0; h < d.length; h++) try {
                r = new ActiveXObject(d[h]);
                break
            } catch (e) {}
        if (typeof r === "undefined" || r === null) throw new a.TransportError("Failed to create an XMLHttpRequest", a.ErrorSubcode.CREATE_XHR_FAILED);
        return r
    }

    function b(r, d, h, e, i, l) {
        this.Options = {
            url: r.match(/^(http|ws)(s?):/i) ? r : window && window.location && window.location.origin ? window.location.origin + (r.charAt(0) !== "/" ? "/" : "") + r : r,
            contentType: l,
            base64Enc: d,
            streamProgressEvents: h
        };
        this.m_streamProgressBytes = 0;
        this.m_xhr = null;
        this.m_rxDataCb = e;
        this.m_connErrorCb = i;
        this.m_reqActive = false;
        this.m_REQCOUNTER = 0;
        this.m_REQBASE = Math.floor(Math.random() * 1E3);
        this.m_xhr = g();
        this.stats = {
            WaitedToken: new a.Util.TimingBucket("WaitedToken", 100),
            HadToken: new a.Util.TimingBucket("HadToken",
                100),
            ReturnedToken: new a.Util.TimingBucket("ReturnedToken", 100),
            toString: function() {
                var c = "";
                a.Util.each([this.WaitedToken, this.HadToken, this.ReturnedToken], function(f) {
                    if (f && f.bucketCount() > 0) c += f.name + ">> " + f.toString() + "\n"
                });
                return c
            }
        };
        this.recStat = function() {}
    }

    function k(r, d, h) {
        if (d !== null) d = a.base64_encode(d);
        r.setRequestHeader("Content-Type", h + "; charset=x-user-defined");
        r.send(d)
    }

    function j(r, d, h) {
        r.overrideMimeType(h + "; charset=x-user-defined");
        r.setRequestHeader("Content-Type", h + "; charset=x-user-defined");
        p(r, d, h)
    }
    a.HttpConnection = b;
    var n = function() {
        if (window.XMLHttpRequest && window.XMLHttpRequest.prototype.sendAsBinary) return "firefox";
        else if (window.XMLHttpRequest && window.Uint8Array && window.ProgressEvent && "overrideMimeType" in new XMLHttpRequest) {
            if (navigator) {
                var r = navigator.userAgent || "";
                if (r.match(/chrome/i)) return "chrome";
                if (r.match(/OS 4(_\d)+ like Mac OS X/i)) return null
            }
            return "xhr2"
        } else return null
    };
    b.browserSupportsXhrBinary = function() {
        return !!n()
    };
    b.browserSupportsStreamingResponse = function() {
        return typeof XMLHttpRequest !==
            "undefined" && "onprogress" in new XMLHttpRequest
    };
    var p = null;
    (function() {
        var r = n();
        p = r === "firefox" ? function(d, h) {
            d.sendAsBinary(h)
        } : r === "xhr2" || r === "chrome" ? function(d, h) {
            var e = new ArrayBuffer(h.length);
            e = new Uint8Array(e, 0);
            for (var i = 0, l = h.length; i < l; i++) e[i] = h.charCodeAt(i);
            r === "chrome" ? d.send(e) : d.send(e.buffer)
        } : function(d, h, e) {
            k(d, h, e)
        }
    })();
    b.prototype.send = function(r, d) {
        d = typeof d === "undefined" ? 0 : d;
        if (d > 0) {
            this.m_xhr.abort();
            this.m_xhr = g()
        }
        this.m_xhr.open("POST", this.Options.url, true);
        var h = this;
        this.m_streamProgressBytes = 0;
        this.m_xhr.onreadystatechange = function() {
            h.xhrStateChange(r, d)
        };
        this.m_reqActive = true;
        this.Options.base64Enc ? k(this.m_xhr, r, this.Options.contentType) : j(this.m_xhr, r, this.Options.contentType);
        this.recStat("SendMsg")
    };
    b.prototype.xhrStateChange = function(r, d) {
        var h = this.m_xhr.readyState;
        if (this.Options.streamProgressEvents && h === 3 || h === 4)
            if (this.m_reqActive)
                if (this.m_xhr.status === 200 || this.m_xhr.status === 304) {
                    var e = this.m_xhr.responseText;
                    e = e.substring(this.m_streamProgressBytes,
                        e.length);
                    this.m_streamProgressBytes += e.length;
                    if (!(e.length === 0 && h === 3)) {
                        if (this.Options.base64Enc) try {
                            e = a.base64_decode(e)
                        } catch (i) {
                            this.m_rxDataCb(3, e);
                            return
                        } else {
                            for (var l = [], c = 0; c < e.length; c++) l.push(String.fromCharCode(e.charCodeAt(c) & 255));
                            e = l.join("")
                        }
                        if (h === 4) this.m_reqActive = false;
                        this.m_rxDataCb(0, e);
                        h === 4 && e.length > 0 && this.m_rxDataCb(0, "")
                    }
                } else {
                    h = this.m_xhr.status;
                    e = this.m_xhr.statusText;
                    l = this.m_xhr.responseText || "";
                    if (d === 0 && this.m_reqActive && h !== 400 && l.length === 0) this.send(r, d + 1);
                    else {
                        this.m_reqActive = false;
                        this.m_connErrorCb(h, "HTTP request failed: status=" + h + " statusText=" + e)
                    }
                }
    };
    b.prototype.isUsingBase64 = function() {
        return this.Options.base64Enc
    };
    b.prototype.abort = function() {
        this.m_reqActive = false;
        this.m_xhr && this.m_xhr.abort && this.m_xhr.abort()
    }
})(solace);
(function(a) {
    function g(b) {
        throw new a.OperationError("Invalid SDT type:value combination, expected value type " + b, a.ErrorSubcode.PARAMETER_INVALID_TYPE);
    }
    a.SDTValueErrorSubcode = {
        VALUE_OUTSIDE_SUPPORTED_RANGE: 1
    };
    a.SDTUnsupportedValueError = function(b, k, j) {
        this.name = "SDTUnsupportedValueError";
        this.message = b || "";
        this.subcode = k;
        this.sourceData = j
    };
    a.SDTUnsupportedValueError.prototype = Error();
    a.SDTUnsupportedValueError.prototype.toString = function() {
        var b = new a.StringBuffer(this.name);
        b.append(": ");
        if (this.name ===
            "SDTUnsupportedValueError") {
            b.append("message=").append(this.message || "").append(", ");
            b.append("subcode=").append(this.subcode || "").append(", ");
            b.append("sourceData=").append(a.StringUtil.formatDumpBytes(this.sourceData, false, 0))
        } else b.append("message=").append(this.message || "");
        return b.toString()
    };
    a.SDTUnsupportedValueError.prototype.getSubcode = function() {
        return this.subcode
    };
    a.SDTUnsupportedValueError.prototype.getSourceData = function() {
        return this.sourceData
    };
    a.SDTField = function() {
        this.m_type =
            a.SDTFieldType.NULLTYPE;
        this.m_error = this.m_value = null
    };
    a.SDTField.create = function(b, k, j) {
        var n = [];
        n[a.SDTFieldType.BOOL] = "boolean";
        n[a.SDTFieldType.UINT8] = "number";
        n[a.SDTFieldType.INT8] = "number";
        n[a.SDTFieldType.UINT16] = "number";
        n[a.SDTFieldType.INT16] = "number";
        n[a.SDTFieldType.UINT32] = "number";
        n[a.SDTFieldType.INT32] = "number";
        n[a.SDTFieldType.UINT64] = "number";
        n[a.SDTFieldType.INT64] = "number";
        n[a.SDTFieldType.WCHAR] = "string";
        n[a.SDTFieldType.STRING] = "string";
        n[a.SDTFieldType.BYTEARRAY] = "string";
        n[a.SDTFieldType.FLOATTYPE] = "number";
        n[a.SDTFieldType.DOUBLETYPE] = "number";
        if (n[b]) typeof k !== n[b] && g(n[b]);
        else if (b === a.SDTFieldType.MAP && !(k instanceof a.SDTMapContainer)) g("solace.SDTMapContainer");
        else if (b === a.SDTFieldType.STREAM && !(k instanceof a.SDTStreamContainer)) g("solace.SDTStreamContainer");
        else b === a.SDTFieldType.DESTINATION && !(k instanceof a.Destination) && g("solace.Destination");
        n = new a.SDTField;
        n.m_type = b;
        n.m_value = k;
        n.m_error = j ? j : null;
        return n
    };
    a.SDTField.prototype.getType = function() {
        return this.m_type
    };
    a.SDTField.prototype.getValue = function() {
        if (this.m_error) throw this.m_error;
        return this.m_value
    };
    a.SDTField.prototype.toString = function() {
        return "[SDTField type:" + this.getType() + " value:" + this.getValue() + "]"
    };
    a.SDTFieldType = {
        BOOL: 0,
        UINT8: 1,
        INT8: 2,
        UINT16: 3,
        INT16: 4,
        UINT32: 5,
        INT32: 6,
        UINT64: 7,
        INT64: 8,
        WCHAR: 9,
        STRING: 10,
        BYTEARRAY: 11,
        FLOATTYPE: 12,
        DOUBLETYPE: 13,
        MAP: 14,
        STREAM: 15,
        DESTINATION: 16,
        NULLTYPE: 17,
        UNKNOWN: 18,
        SMF_MESSAGE: 19
    };
    a.SDTFieldTypeDescription = function() {
        var b = [],
            k;
        for (k in a.SDTFieldType)
            if (a.SDTFieldType.hasOwnProperty(k)) b[a.SDTFieldType[k]] =
                k;
        return b
    }();
    a.SDTMapContainer = function() {
        this.m_map = []
    };
    a.SDTMapContainer.prototype.getKeys = function() {
        var b = [],
            k;
        for (k in this.m_map) this.m_map.hasOwnProperty(k) && b.push(k);
        return b
    };
    a.SDTMapContainer.prototype.getField = function(b) {
        return this.m_map[b]
    };
    a.SDTMapContainer.prototype.deleteField = function(b) {
        delete this.m_map[b]
    };
    a.SDTMapContainer.prototype.addField = function(b, k) {
        if (k instanceof a.SDTField) this.m_map[b] = k;
        else if (arguments.length >= 3) this.m_map[arguments[0]] = a.SDTField.create(arguments[1],
            arguments[2])
    };
    a.SDTStreamContainer = function() {
        this.m_stream = [];
        this.m_writable = true;
        this.m_readPt = 0
    };
    a.SDTStreamContainer.prototype.hasNext = function() {
        return this.m_stream.length > this.m_readPt
    };
    a.SDTStreamContainer.prototype.getNext = function() {
        return this.m_readPt < this.m_stream.length ? this.m_stream[this.m_readPt++] : undefined
    };
    a.SDTStreamContainer.prototype.rewind = function() {
        this.m_readPt = 0
    };
    a.SDTStreamContainer.prototype.addField = function(b) {
        if (this.m_writable)
            if (b instanceof a.SDTField) this.m_stream.push(b);
            else arguments.length >= 2 && this.m_stream.push(a.SDTField.create(arguments[0], arguments[1]))
    };
    a.sdt = a.sdt || {};
    a.sdt.Codec = function() {
        function b(m) {
            switch (m.length) {
                case 1:
                    return a.Convert.strToInt8(m);
                case 2:
                    return a.Convert.strToInt16(m);
                case 3:
                    return a.Convert.strToInt24(m);
                case 4:
                    return a.Convert.strToInt32(m);
                default:
                    return false
            }
        }

        function k(m) {
            for (var s = [], t = 0; t < 6; t++) {
                var q = m % 256;
                m = Math.floor(m / 256);
                s.push(String.fromCharCode(q))
            }
            s.reverse();
            return s.join("")
        }

        function j(m, s) {
            var t = false,
                q = 0;
            switch (s.length) {
                case 1:
                    q =
                        a.Convert.strToInt8(s);
                    if (m) {
                        if (t = (q & 128) !== 0) q -= 256;
                        return e(a.SDTFieldType.INT8, q)
                    } else return e(a.SDTFieldType.UINT8, q);
                case 2:
                    q = a.Convert.strToInt16(s);
                    if (m) {
                        if (t = (q & 32768) !== 0) q -= 65536;
                        return e(a.SDTFieldType.INT16, q)
                    } else return e(a.SDTFieldType.UINT16, q);
                case 4:
                    q = a.Convert.strToInt32(s);
                    if (m) return e(a.SDTFieldType.INT32, q);
                    else {
                        t = s.charCodeAt(0);
                        var u = s.charCodeAt(1);
                        q = s.charCodeAt(2);
                        var v = s.charCodeAt(3);
                        q = t * 16777216 + u * 65536 + q * 256 + v;
                        return e(a.SDTFieldType.UINT32, q)
                    }
                    case 8:
                        t = s.substr(0,
                            8);
                        u = [];
                        for (q = t.length - 1; q >= 0; q--) {
                            v = t.charCodeAt(q) & 255;
                            for (var w = 0; w < 8; w++) {
                                u.push(v % 2 ? 1 : 0);
                                v >>= 1
                            }
                        }
                        u.reverse();
                        q = u.join("");
                        u = null;
                        t = m && q.substr(0, 1) === "1";
                        v = parseInt(q.substr(1, 15), 2);
                        if (!t && v !== 0 || t && v !== 32767) u = new a.SDTUnsupportedValueError("Value is not supported", a.SDTValueErrorSubcode.VALUE_OUTSIDE_SUPPORTED_RANGE, s);
                        q = parseInt(q.substr(16, 48), 2);
                        if (m) {
                            if (t) q -= Math.pow(2, 48);
                            return e(a.SDTFieldType.INT64, q, u)
                        } else return e(a.SDTFieldType.UINT64, q, u)
            }
            return null
        }

        function n(m, s) {
            var t = s,
                q =
                a.Convert.strToInt8(m.substr(t, 1)),
                u = (q & 252) >> 2;
            q = (q & 3) + 1;
            t++;
            var v = b(m.substr(t, q));
            t += q;
            return [u, v, v - (1 + q), t - s]
        }

        function p(m, s) {
            var t = n(m, s);
            if (!t) return false;
            var q = s + t[3],
                u = 0;
            u = t[2];
            switch (t[0]) {
                case h.Null:
                    return e(a.SDTFieldType.NULLTYPE, null);
                case h.Boolean:
                    u = a.Convert.strToInt8(m.substr(q, 1));
                    return e(a.SDTFieldType.BOOL, u !== 0);
                case h.Integer:
                    return j(true, m.substr(q, u));
                case h.UnsignedInteger:
                    return j(false, m.substr(q, u));
                case h.Float:
                    a: {
                        q = m.substr(q, u);
                        switch (q.length) {
                            case 4:
                                q = e(a.SDTFieldType.FLOATTYPE,
                                    i.fromIEEE754Single(q));
                                break a;
                            case 8:
                                q = e(a.SDTFieldType.DOUBLETYPE, i.fromIEEE754Double(q));
                                break a;
                            default:
                                q = e(a.SDTFieldType.UNKNOWN, q)
                        }
                    }
                    return q;
                case h.Char:
                    u = a.Convert.strToInt16(m.substr(q, 2));
                    return e(a.SDTFieldType.WCHAR, String.fromCharCode(u));
                case h.ByteArray:
                    return e(a.SDTFieldType.BYTEARRAY, m.substr(q, u));
                case h.String:
                    t = e;
                    var v = a.SDTFieldType.STRING;
                    q = m.substr(q, u - 1);
                    q = decodeURIComponent(escape(q));
                    return t(v, q);
                case h.Destination:
                    t = a.Convert.strToInt8(m.substr(q, 1));
                    q = m.substr(q + 1, u -
                        2);
                    return e(a.SDTFieldType.DESTINATION, t === 0 ? new a.Topic(q) : null);
                case h.SMFMessage:
                    return e(a.SDTFieldType.SMF_MESSAGE, m.substr(q, u));
                case h.Map:
                    return l(m, q, u);
                case h.Stream:
                    return c(m, q, u);
                default:
                    return e(a.SDTFieldType.UNKNOWN, m.substr(q, u))
            }
        }

        function r(m, s) {
            var t = m << 2 & 255,
                q = null;
            if (m === h.Map || m === h.Stream) {
                q = a.Convert.int32ToStr(s + 5);
                t |= 3
            } else if (s + 2 <= 255) {
                q = a.Convert.int8ToStr(s + 2);
                t |= 0
            } else if (s + 3 <= 65535) {
                q = a.Convert.int16ToStr(s + 3);
                t |= 1
            } else {
                q = a.Convert.int32ToStr(s + 5);
                t |= 3
            }
            return a.Convert.int8ToStr(t) +
                q
        }

        function d(m, s) {
            if (!(m instanceof a.SDTField)) return false;
            var t = null,
                q = m.getValue(),
                u = 0,
                v = 0;
            switch (m.getType()) {
                case a.SDTFieldType.BOOL:
                    u = h.Boolean;
                    t = a.Convert.int8ToStr(q ? 1 : 0);
                    break;
                case a.SDTFieldType.UINT8:
                    u = h.UnsignedInteger;
                    t = a.Convert.int8ToStr(q);
                    break;
                case a.SDTFieldType.INT8:
                    u = h.Integer;
                    t = a.Convert.int8ToStr(q);
                    break;
                case a.SDTFieldType.UINT16:
                    u = h.UnsignedInteger;
                    t = a.Convert.int16ToStr(q);
                    break;
                case a.SDTFieldType.INT16:
                    u = h.Integer;
                    t = a.Convert.int16ToStr(q);
                    break;
                case a.SDTFieldType.UINT32:
                    u =
                        h.UnsignedInteger;
                    t = a.Convert.int32ToStr(q);
                    break;
                case a.SDTFieldType.INT32:
                    u = h.Integer;
                    t = a.Convert.int32ToStr(q);
                    break;
                case a.SDTFieldType.UINT64:
                    u = h.UnsignedInteger;
                    t = String.fromCharCode(0) + String.fromCharCode(0) + k(q);
                    break;
                case a.SDTFieldType.INT64:
                    u = h.Integer;
                    if (q >= 0) t = String.fromCharCode(0) + String.fromCharCode(0) + k(q);
                    else {
                        t = Math.pow(2, 48) + q;
                        t = String.fromCharCode(255) + String.fromCharCode(255) + k(t)
                    }
                    break;
                case a.SDTFieldType.WCHAR:
                    u = h.Char;
                    v = q.charCodeAt(0);
                    t = a.Convert.int16ToStr(v);
                    break;
                case a.SDTFieldType.STRING:
                    u =
                        h.String;
                    t = a.Util.nullTerminate(unescape(encodeURIComponent(q)));
                    break;
                case a.SDTFieldType.BYTEARRAY:
                    u = h.ByteArray;
                    t = q;
                    break;
                case a.SDTFieldType.FLOATTYPE:
                    u = h.Float;
                    t = i.toIEEE754Single(q);
                    break;
                case a.SDTFieldType.DOUBLETYPE:
                    u = h.Float;
                    t = i.toIEEE754Double(q);
                    break;
                case a.SDTFieldType.MAP:
                    u = h.Map;
                    t = f(q);
                    break;
                case a.SDTFieldType.STREAM:
                    u = h.Stream;
                    t = o(q);
                    break;
                case a.SDTFieldType.DESTINATION:
                    u = h.Destination;
                    if (q instanceof a.Topic) {
                        t = a.Convert.int8ToStr(0);
                        t += a.Util.nullTerminate(q.getName())
                    }
                    break;
                case a.SDTFieldType.NULLTYPE:
                    u = h.Null;
                    t = "";
                    break;
                case a.SDTFieldType.UNKNOWN:
                    t = null
            }
            if (t !== null) {
                u = r(u, t.length);
                s.push(u);
                s.push(t)
            }
        }
        var h = {
                Null: 0,
                Boolean: 1,
                Integer: 2,
                UnsignedInteger: 3,
                Float: 4,
                Char: 5,
                ByteArray: 6,
                String: 7,
                Destination: 8,
                SMFMessage: 9,
                Map: 10,
                Stream: 11
            },
            e = a.SDTField.create,
            i = {
                toIEEE754: function(m, s, t) {
                    var q = (1 << s - 1) - 1,
                        u, v;
                    if (isNaN(m)) {
                        v = (1 << q) - 1;
                        q = 1;
                        u = 0
                    } else if (m === Infinity || m === -Infinity) {
                        v = (1 << q) - 1;
                        q = 0;
                        u = m < 0 ? 1 : 0
                    } else if (m === 0) {
                        q = v = 0;
                        u = 1 / m === -Infinity ? 1 : 0
                    } else {
                        u = m < 0;
                        m = Math.abs(m);
                        if (m >=
                            Math.pow(2, 1 - q)) {
                            var w = Math.min(Math.floor(Math.log(m) / Math.LN2), q);
                            v = w + q;
                            q = m * Math.pow(2, t - w) - Math.pow(2, t)
                        } else {
                            v = 0;
                            q = m / Math.pow(2, 1 - q - t)
                        }
                    }
                    m = [];
                    for (t = t; t; t -= 1) {
                        m.push(q % 2 ? 1 : 0);
                        q = Math.floor(q / 2)
                    }
                    for (t = s; t; t -= 1) {
                        m.push(v % 2 ? 1 : 0);
                        v = Math.floor(v / 2)
                    }
                    m.push(u ? 1 : 0);
                    m.reverse();
                    s = m.join("");
                    for (u = []; s.length;) {
                        u.push(parseInt(s.substring(0, 8), 2));
                        s = s.substring(8)
                    }
                    return u
                },
                fromIEEE754: function(m, s, t) {
                    for (var q = [], u = m.length; u; u -= 1)
                        for (var v = m[u - 1], w = 8; w; w -= 1) {
                            q.push(v % 2 ? 1 : 0);
                            v >>= 1
                        }
                    q.reverse();
                    v = q.join("");
                    m = (1 << s - 1) - 1;
                    q = parseInt(v.substring(0, 1), 2) ? -1 : 1;
                    u = parseInt(v.substring(1, 1 + s), 2);
                    v = parseInt(v.substring(1 + s), 2);
                    return u === (1 << s) - 1 ? v !== 0 ? NaN : q * Infinity : u > 0 ? q * Math.pow(2, u - m) * (1 + v / Math.pow(2, t)) : v !== 0 ? q * Math.pow(2, -(m - 1)) * (v / Math.pow(2, t)) : q * 0
                },
                strToByteArr: function(m) {
                    for (var s = [], t = 0; t < m.length; t++) s.push(m.charCodeAt(t) & 255);
                    return s
                },
                byteArrToStr: function(m) {
                    for (var s = [], t = 0; t < m.length; t++) s.push(String.fromCharCode(m[t] & 255));
                    return s.join("")
                },
                fromIEEE754Double: function(m) {
                    return this.fromIEEE754(this.strToByteArr(m),
                        11, 52)
                },
                toIEEE754Double: function(m) {
                    return this.byteArrToStr(this.toIEEE754(m, 11, 52))
                },
                fromIEEE754Single: function(m) {
                    return this.fromIEEE754(this.strToByteArr(m), 8, 23)
                },
                toIEEE754Single: function(m) {
                    return this.byteArrToStr(this.toIEEE754(m, 8, 23))
                }
            },
            l = null,
            c = null,
            f = null,
            o = null;
        f = function(m) {
            var s = [];
            if (!(m instanceof a.SDTMapContainer)) return null;
            for (var t = m.getKeys(), q = null, u = null, v = null, w = 0; w < t.length; w++)
                if (q = m.getField(t[w])) {
                    v = a.Util.nullTerminate(t[w]);
                    u = r(h.String, v.length);
                    u += v;
                    s.push(u);
                    d(q,
                        s)
                } return s.join("")
        };
        o = function(m) {
            var s = [];
            if (!(m instanceof a.SDTStreamContainer)) return null;
            for (var t = null; m.hasNext();)(t = m.getNext()) && d(t, s);
            return s.join("")
        };
        l = function(m, s, t) {
            for (var q = s, u = new a.SDTMapContainer; q < s + t;) {
                var v = n(m, q);
                q += v[3];
                if (v[0] !== h.String) return e(a.SDTFieldType.MAP, null);
                var w = m.substr(q, v[2] - 1);
                q += v[2];
                v = n(m, q);
                var z = p(m, q);
                q += v[1];
                u.addField(w, z)
            }
            return e(a.SDTFieldType.MAP, u)
        };
        c = function(m, s, t) {
            for (var q = new a.SDTStreamContainer, u = s; u < s + t;) {
                var v = n(m, u),
                    w = p(m, u);
                u += v[1];
                w && q.addField(w)
            }
            return e(a.SDTFieldType.STREAM, q)
        };
        return {
            parseSdt: p,
            encodeSdt: function(m) {
                var s = [];
                d(m, s);
                return s.join("")
            },
            IEEE754LIB: i
        }
    }()
})(solace);
(function(a) {
    var g = a.ErrorSubcode,
        b = a.SessionEventCode,
        k = a.TransportSessionEventCode,
        j = a.GlobalContext,
        n = a.P2PUtil,
        p = a.TopicUtil,
        r = a.StringUtil,
        d = a.Util,
        h = a.StatType,
        e = a.MutableSessionProperty,
        i = a.SessionState,
        l = a.Util.strFmt;
    a.Session = function(c, f, o) {
        if (!c) throw new a.OperationError("Session properties cannot be null", g.PARAMETER_OUT_OF_RANGE);
        c.sol_validate();
        this.m_sessionProperties = c.clone();
        this.resetTransportProtocolHandler();
        this.m_transportProtocolHandler.validateProperties();
        if (!(f instanceof a.MessageRxCBInfo)) throw new a.OperationError("Invalid parameter type for messageCallbackInfo", g.PARAMETER_INVALID_TYPE);
        if (!(o instanceof a.SessionEventCBInfo)) throw new a.OperationError("Invalid parameter type for eventCallbackInfo", g.PARAMETER_INVALID_TYPE);
        this.m_messageCallbackInfo = f;
        this.m_eventCallbackInfo = o;
        if (!r.notEmpty(this.m_sessionProperties.clientName)) this.m_sessionProperties.clientName = a.GlobalContext.GenerateClientName();
        this.m_sessionProperties.userIdentification = a.GlobalContext.GenerateUserIdentification();
        if (!r.notEmpty(this.m_sessionProperties.applicationDescription)) this.m_sessionProperties.applicationDescription = a.GlobalContext.GenerateClientDescription();
        this.m_sessionState = 0;
        this.m_sessionStatistics = new a.SessionStatistics;
        this.m_keepAliveTimer = this.m_sessionId = null;
        this.m_keepAliveCounter = 0;
        this.m_outstandingCtrlReqs = {};
        this.m_outstandingDataReqs = {};
        this.m_newSession = true;
        this.m_disposed = this.m_inReconnect = false;
        this.m_smfClient = null;
        this.m_kaStats = {
            lastMsgWritten: 0,
            lastBytesWritten: 0
        };
        this.m_subscriptionCacheKeys =
            this.m_subscriptionCache = this.m_capabilities = null;
        this.m_subscriptionCacheCount = 0;
        if (this.m_sessionProperties.reapplySubscriptions) this.m_subscriptionCache = {};
        this.m_seqNum = 1;
        this.m_lastKnownGoodTransport = null
    };
    a.Session.prototype.connect = function() {
        this.beginConnect(this.m_lastKnownGoodTransport)
    };
    a.Session.prototype.connectInternal = function() {
        try {
            this.beginConnect(null)
        } catch (c) {
            this.m_inReconnect = false;
            this.changeState(9);
            this.sendEvent(new a.SessionEvent(b.CONNECT_FAILED_ERROR, "Downgrade connect failed.",
                null, c.subcode ? c.subcode : g.UNKNOWN_ERROR, null, c))
        }
    };
    a.Session.prototype.beginConnect = function(c) {
        var f = this.allowOperation(0);
        if (f) throw new a.OperationError(f, g.INVALID_SESSION_OPERATION, null);
        if (this.m_newSession) this.m_newSession = false;
        else {
            this.cleanupSession();
            this.m_inReconnect = true
        }
        this.m_connectTimer || this.setConnectTimer();
        var o = this;
        this.m_kaStats = {
            lastMsgWritten: 0,
            lastBytesWritten: 0
        };
        f = this.m_sessionProperties.clone();
        c && this.m_transportProtocolHandler.setProtocol(c);
        f.transportProtocol =
            this.m_transportProtocolHandler.getTransportProtocol();
        if (!this.m_transportProtocolHandler.shouldRetry()) f.transportDowngradeTimeoutInMsecs = 0;
        this.m_smfClient = new a.SMFClient(f, function(t) {
            o.handleSmfMessage(t)
        }, function(t) {
            o.handleSmfParseError(t)
        }, function(t) {
            o.handleTransportEvent(t)
        }, o);
        this.changeState(2);
        this.sendEvent(new a.SessionEvent(b.CONNECTING, l("Establishing connection (transport:{0})", this.m_transportProtocolHandler), null, null, null, null));
        try {
            var m = this.m_smfClient.connect();
            if (m !==
                0) {
                this.clearConnectTimer();
                throw new a.OperationError("Cannot establish transport session", g.INTERNAL_CONNECTION_ERROR, m);
            }
        } catch (s) {
            this.clearConnectTimer();
            throw new a.OperationError("Cannot establish transport session", g.INTERNAL_CONNECTION_ERROR, s);
        }
    };
    a.Session.prototype.setConnectTimer = function() {
        this.clearConnectTimer();
        var c = this;
        this.m_connectTimer = setTimeout(function() {
            c.handleConnectTimeout()
        }, this.m_sessionProperties.connectTimeoutInMsecs)
    };
    a.Session.prototype.clearConnectTimer = function() {
        if (this.m_connectTimer) {
            clearTimeout(this.m_connectTimer);
            this.m_connectTimer = null
        }
    };
    a.Session.prototype.handleConnectTimeout = function() {
        this.m_inReconnect = false;
        this.disconnectInternal()
    };
    a.Session.prototype.resetTransportProtocolHandler = function() {
        this.m_transportProtocolHandler = new a.TransportProtocolHandler(this.m_sessionProperties)
    };
    a.Session.prototype.disconnect = function() {
        this.disconnectInternal()
    };
    a.Session.prototype.disconnectInternal = function() {
        var c = this.allowOperation(1);
        if (c) throw new a.OperationError(c, g.INVALID_SESSION_OPERATION, null);
        if (this.m_sessionState !==
            1 && this.m_sessionState !== 10) this.m_sessionState = 10;
        this.clearConnectTimer();
        this.cleanupSession();
        this.resetTransportProtocolHandler();
        this.destroyTransportSession()
    };
    a.Session.prototype.dispose = function() {
        try {
            if (!this.m_disposed) {
                if (this.allowOperation(1) === null) {
                    this.m_inReconnect = false;
                    this.disconnectInternal()
                }
                this.m_capabilities = null;
                this.m_sessionStatistics && this.m_sessionStatistics.resetStats();
                this.m_sessionStatistics = null;
                if (this.m_subscriptionCache)
                    for (var c in this.m_subscriptionCache) this.m_subscriptionCache.hasOwnProperty(c) &&
                        this.removeFromSubscriptionCache(c);
                this.m_subscriptionCache = null;
                this.clearSubscriptionCacheKeys();
                this.m_subscriptionCacheCount = 0;
                this.m_outstandingDataReqs = this.m_outstandingCtrlReqs = null;
                this.m_disposed = true
            }
        } catch (f) {}
    };
    a.Session.prototype.subscribe = function(c, f, o, m) {
        var s = this.allowOperation(4);
        if (s) throw new a.OperationError(s, g.INVALID_SESSION_OPERATION, null);
        if (!(c instanceof a.Topic)) throw new a.OperationError("Invalid parameter type for topic.", g.PARAMETER_INVALID_TYPE);
        if (s = p.validateTopic(c.getName())) throw new a.OperationError(s,
            g.INVALID_TOPIC_SYNTAX, null);
        if (typeof f !== "undefined" && f !== null && typeof f !== "boolean") throw new a.OperationError("Invalid parameter type for requestConfirmation.", g.PARAMETER_INVALID_TYPE);
        if (typeof m !== "undefined" && m !== null)
            if (typeof m !== "number") throw new a.OperationError("Invalid parameter type for requestTimeout.", g.PARAMETER_INVALID_TYPE);
            else if (m <= 0) throw new a.OperationError("Request timeout must be greater than 0.", g.PARAMETER_OUT_OF_RANGE);
        var t = this;
        this.subscriptionUpdate(c, f, o, m, 2, function(q,
            u) {
            t.handleSubscriptionUpdateResponse(q, u)
        })
    };
    a.Session.prototype.unsubscribe = function(c, f, o, m) {
        var s = this.allowOperation(4);
        if (s) throw new a.OperationError(s, g.INVALID_SESSION_OPERATION, null);
        if (!(c instanceof a.Topic)) throw new a.OperationError("Invalid parameter type for topic.", g.PARAMETER_INVALID_TYPE);
        if (s = p.validateTopic(c.getName())) throw new a.OperationError(s, g.INVALID_TOPIC_SYNTAX, null);
        if (typeof f !== "undefined" && f !== null && typeof f !== "boolean") throw new a.OperationError("Invalid parameter type for requestConfirmation.",
            g.PARAMETER_INVALID_TYPE);
        if (typeof m !== "undefined" && m !== null)
            if (typeof m !== "number") throw new a.OperationError("Invalid parameter type for requestTimeout", g.PARAMETER_INVALID_TYPE);
            else if (m <= 0) throw new a.OperationError("Request timeout must be greater than 0.", g.PARAMETER_OUT_OF_RANGE);
        var t = this;
        this.subscriptionUpdate(c, f, o, m, 3, function(q, u) {
            t.handleSubscriptionUpdateResponse(q, u)
        })
    };
    a.Session.prototype.updateProperty = function(c, f, o, m) {
        var s = this.allowOperation(4);
        if (s) throw new a.OperationError(s,
            g.INVALID_SESSION_OPERATION, null);
        s = false;
        for (var t in e)
            if (e.hasOwnProperty(t))
                if (e[t] === c) s = true;
        if (!s) throw new a.OperationError("Invalid parameter value for mutableSessionProperty.", g.PARAMETER_OUT_OF_RANGE);
        if (typeof o !== "undefined" && o !== null)
            if (typeof o !== "number") throw new a.OperationError("Invalid parameter type for requestTimeout.", g.PARAMETER_INVALID_TYPE);
            else if (o <= 0) throw new a.OperationError("Request timeout must be greater than 0.", g.PARAMETER_OUT_OF_RANGE);
        t = [];
        t[e.CLIENT_DESCRIPTION] =
            6;
        t[e.CLIENT_NAME] = 5;
        var q = this.m_smfClient.nextCorrelationTag();
        s = a.smf.ClientCtrlMessage.getUpdate(c, f, q);
        var u = this,
            v, w = b.PROPERTY_UPDATE_OK,
            z = b.PROPERTY_UPDATE_ERROR,
            B = this.m_smfClient.send(s);
        if (B !== 0) {
            this.changeState(9);
            v = B === 2 ? new a.SessionEvent(z, "Property update failed - no space in transport", null, g.INSUFFICIENT_SPACE, null, null) : new a.SessionEvent(z, "Property update failed", null, g.INVALID_SESSION_OPERATION, null, null);
            this.sendEvent(v)
        } else {
            this.updateTxStats(s);
            this.enqueueOutstandingCtrlReq(q,
                function() {
                    u.handleOperationTimeout(q, "Update request timeout")
                }, o || this.m_sessionProperties.readTimeoutInMsecs, t[c] || 0, m,
                function(C) {
                    var A = C.getResponse();
                    if (A.ResponseCode === 200)
                        if (c === e.CLIENT_DESCRIPTION) {
                            u.m_sessionProperties.applicationDescription = f;
                            v = new a.SessionEvent(w, A.ResponseString, A.ResponseCode, 0, m, null);
                            u.sendEvent(v)
                        } else {
                            if (c === e.CLIENT_NAME) {
                                A = n.getP2PTopicSubscription(u.m_sessionProperties.p2pInboxBase);
                                var D = n.getP2PTopicSubscription(C.getP2PTopicValue()),
                                    E = function(x) {
                                        x = x.getResponse();
                                        if (x.ResponseCode === 200) {
                                            u.m_sessionProperties.p2pInboxBase = C.getP2PTopicValue() || "";
                                            u.m_sessionProperties.p2pInboxInUse = n.getP2PInboxTopic(u.m_sessionProperties.p2pInboxBase);
                                            u.m_sessionProperties.clientName = f;
                                            v = new a.SessionEvent(w, x.ResponseString, x.ResponseCode, 0, m, null)
                                        } else {
                                            var y = a.ErrorResponseSubCodeMapper.getErrorSubCode(x.ResponseCode, x.ResponseString);
                                            v = y === g.SUBSCRIPTION_ALREADY_PRESENT && u.m_sessionProperties.ignoreDuplicateSubscriptionError ? new a.SessionEvent(w, x.ResponseString, x.ResponseCode,
                                                0, m, null) : y === g.SUBSCRIPTION_ALREADY_PRESENT || y === g.SUBSCRIPTION_ATTRIBUTES_CONFLICT || y === g.SUBSCRIPTION_INVALID || y === g.SUBSCRIPTION_ACL_DENIED || y === g.SUBSCRIPTION_TOO_MANY ? new a.SessionEvent(z, x.ResponseString, x.ResponseCode, y, m, null) : new a.SessionEvent(z, x.ResponseString, x.ResponseCode, g.SUBSCRIPTION_ERROR_OTHER, m, null)
                                        }
                                        u.sendEvent(v)
                                    };
                                u.sendUpdateP2PInboxReg(false, A, m, function(x) {
                                    x = x.getResponse();
                                    if (x.ResponseCode === 200) u.sendUpdateP2PInboxReg(true, D, m, E);
                                    else {
                                        var y = a.ErrorResponseSubCodeMapper.getErrorSubCode(x.ResponseCode,
                                            x.ResponseString);
                                        if (y === g.SUBSCRIPTION_NOT_FOUND && u.m_sessionProperties.ignoreSubscriptionNotFoundError) u.sendUpdateP2PInboxReg(true, D, m, E);
                                        else {
                                            v = y === g.SUBSCRIPTION_ATTRIBUTES_CONFLICT || y === g.SUBSCRIPTION_INVALID || y === g.SUBSCRIPTION_NOT_FOUND || y === g.SUBSCRIPTION_ACL_DENIED ? new a.SessionEvent(z, x.ResponseString, x.ResponseCode, y, null, null) : new a.SessionEvent(z, x.ResponseString, x.ResponseCode, g.SUBSCRIPTION_ERROR_OTHER, null, null);
                                            u.sendEvent(v)
                                        }
                                    }
                                })
                            }
                        }
                    else {
                        var F = a.ErrorResponseSubCodeMapper.getErrorSubCode(A.ResponseCode,
                            A.ResponseString);
                        v = new a.SessionEvent(z, A.ResponseString, A.ResponseCode, F, m, null);
                        u.sendEvent(v)
                    }
                })
        }
    };
    a.Session.prototype.send = function(c) {
        var f = this.allowOperation(5);
        if (f) throw new a.OperationError(f, g.INVALID_SESSION_OPERATION, null);
        if (!(c instanceof a.Message)) throw new a.OperationError("Invalid parameter type for message", g.PARAMETER_INVALID_TYPE);
        this.handleSendMessage(c)
    };
    a.Session.prototype.sendRequest = function(c, f, o, m, s) {
        var t = this.allowOperation(5);
        if (t) throw new a.OperationError(t, g.INVALID_SESSION_OPERATION,
            null);
        if (!(c instanceof a.Message)) throw new a.OperationError("Invalid parameter type for message.", g.PARAMETER_INVALID_TYPE);
        if (typeof f !== "undefined" && f !== null) {
            d.checkParamTypeOf(f, "number", "timeout");
            if (f < 100) throw new a.OperationError("Request timeout must be greater than or equal to 100.", g.PARAMETER_OUT_OF_RANGE);
        }
        if (typeof o === "undefined" || o === null || typeof o !== "function") throw new a.OperationError("Invalid parameter type for replyReceivedCBFunction.", g.PARAMETER_INVALID_TYPE);
        if (typeof m ===
            "undefined" || m === null || typeof m !== "function") throw new a.OperationError("Invalid parameter type for requestFailedCBFunction.", g.PARAMETER_INVALID_TYPE);
        c.setCorrelationId("#REQ" + j.NextId());
        t = a.SolclientFactory.createTopic(this.m_sessionProperties.p2pInboxInUse);
        c.setReplyTo(t);
        this.handleSendMessage(c);
        this.enqueueOutstandingDataReq(c.getCorrelationId(), m, f, o, s)
    };
    a.Session.prototype.sendReply = function(c, f) {
        var o = this.allowOperation(5);
        if (o) throw new a.OperationError(o, g.INVALID_SESSION_OPERATION,
            null);
        if (typeof c !== "undefined" && c !== null && !(c instanceof a.Message)) throw new a.OperationError("Invalid parameter type for messageToReplyTo.", g.PARAMETER_INVALID_TYPE);
        if (!(f instanceof a.Message)) throw new a.OperationError("Invalid parameter type for replyMessage.", g.PARAMETER_INVALID_TYPE);
        f.setAsReplyMessage(true);
        if (typeof c !== "undefined" && c !== null) {
            f.setCorrelationId(c.getCorrelationId());
            if (c.getReplyTo() === null) throw new a.OperationError("ReplyTo destination may not be null.", g.PARAMETER_OUT_OF_RANGE);
            f.setDestination(c.getReplyTo())
        }
        this.handleSendMessage(f)
    };
    a.Session.prototype.getStat = function(c) {
        var f = this.allowOperation(7);
        if (f) throw new a.OperationError(f, g.INVALID_SESSION_OPERATION, null);
        f = false;
        for (var o in h)
            if (h.hasOwnProperty(o))
                if (h[o] === c) f = true;
        if (!f) throw new a.OperationError("Invalid parameter value for statType.", g.PARAMETER_OUT_OF_RANGE);
        return this.m_sessionStatistics.getStat(c)
    };
    a.Session.prototype.resetStats = function() {
        var c = this.allowOperation(7);
        if (c) throw new a.OperationError(c,
            g.INVALID_SESSION_OPERATION, null);
        this.m_sessionStatistics.resetStats()
    };
    a.Session.prototype.getSessionProperties = function() {
        var c = this.allowOperation(7);
        if (c) throw new a.OperationError(c, g.INVALID_SESSION_OPERATION, null);
        c = this.m_sessionProperties.clone();
        if (this.m_sessionState !== 1 && this.m_transportProtocolHandler) c.transportProtocolInUse = this.m_transportProtocolHandler.getTransportProtocol();
        return c
    };
    a.Session.prototype.isCapable = function(c) {
        var f = this.allowOperation(7);
        if (f) throw new a.OperationError(f,
            g.INVALID_SESSION_OPERATION, null);
        if (typeof c !== "number") throw new a.OperationError("Invalid parameter type for capabilityType.", g.PARAMETER_INVALID_TYPE);
        f = this.m_capabilities;
        if (!f) return false;
        return typeof f[c] === "boolean" ? f[c] : false
    };
    a.Session.prototype.getCapability = function(c) {
        var f = this.allowOperation(7);
        if (f) throw new a.OperationError(f, g.INVALID_SESSION_OPERATION, null);
        if (typeof c !== "number") throw new a.OperationError("Invalid parameter type for capabilityType", g.PARAMETER_INVALID_TYPE);
        f = this.m_capabilities;
        if (!f || typeof f[c] === "undefined") return null;
        c = f[c];
        return typeof c === "boolean" ? a.SDTField.create(a.SDTFieldType.BOOL, c) : typeof c === "number" ? a.SDTField.create(a.SDTFieldType.INT64, c) : typeof c === "string" ? a.SDTField.create(a.SDTFieldType.STRING, c) : null
    };
    a.Session.prototype.getSessionState = function() {
        var c = this.allowOperation(7);
        if (c) throw new a.OperationError(c, g.INVALID_SESSION_OPERATION, null);
        switch (this.m_sessionState) {
            case 0:
                return i.NEW;
            case 8:
                return i.CONNECTED;
            case 10:
                return i.DISCONNECTING;
            case 1:
                return i.DISCONNECTED;
            case 9:
                return i.SESSION_ERROR;
            default:
                return i.CONNECTING
        }
    };
    a.Session.prototype.createCacheSession = function(c) {
        return new a.CacheSession(c, this)
    };
    a.Session.prototype.updateRxStats = function(c) {
        var f = c.getSmfHeader ? c.getSmfHeader() : null;
        if (f) {
            var o = f.m_messageLength;
            switch (f.m_smf_protocol) {
                case 13:
                    if (f.m_pm_respcode === 0) {
                        this.m_sessionStatistics.incStat(h.RX_TOTAL_DATA_MSGS);
                        this.m_sessionStatistics.incStat(h.RX_DIRECT_MSGS);
                        this.m_sessionStatistics.incStat(h.RX_TOTAL_DATA_BYTES,
                            o);
                        this.m_sessionStatistics.incStat(h.RX_DIRECT_BYTES, o);
                        c.m_discardIndication && this.m_sessionStatistics.incStat(h.RX_DISCARD_MSG_INDICATION)
                    }
                    break;
                case 12:
                case 15:
                case 10:
                case 11:
                    this.m_sessionStatistics.incStat(h.RX_CONTROL_MSGS);
                    this.m_sessionStatistics.incStat(h.RX_CONTROL_BYTES, o)
            }
        }
    };
    a.Session.prototype.updateTxStats = function(c) {
        typeof c.getReplyTo !== "undefined" && c.getReplyTo() && this.m_sessionStatistics.incStat(h.TX_REQUEST_SENT);
        if (c = c.getSmfHeader ? c.getSmfHeader() : null) {
            var f = c.m_messageLength;
            switch (c.m_smf_protocol) {
                case 13:
                    this.m_sessionStatistics.incStat(h.TX_TOTAL_DATA_MSGS);
                    this.m_sessionStatistics.incStat(h.TX_DIRECT_MSGS);
                    this.m_sessionStatistics.incStat(h.TX_TOTAL_DATA_BYTES, f);
                    this.m_sessionStatistics.incStat(h.TX_DIRECT_BYTES, f);
                    break;
                case 12:
                case 15:
                case 10:
                case 11:
                    this.m_sessionStatistics.incStat(h.TX_CONTROL_MSGS);
                    this.m_sessionStatistics.incStat(h.TX_CONTROL_BYTES, f)
            }
        }
    };
    a.Session.prototype.sendEvent = function(c) {
        if (c)
            if (this.m_eventCallbackInfo) this.m_eventCallbackInfo.userObject ?
                this.m_eventCallbackInfo.sessionEventCBFunction(this, c, this.m_eventCallbackInfo.userObject) : this.m_eventCallbackInfo.sessionEventCBFunction(this, c)
    };
    a.Session.prototype.shallNotifyClient = function() {
        return this.m_sessionState !== 9 && this.m_sessionState !== 10 && this.m_sessionState !== 1 && !this.m_disposed
    };
    a.Session.prototype.changeState = function(c) {
        if (c && this.m_sessionState !== c) {
            var f = this.m_sessionState;
            if ((f === 10 || f === 1) && c !== 1) {
                if (f === 1 && this.m_inReconnect && c === 2) this.m_sessionState = c
            } else {
                this.m_sessionState =
                    c;
                c === 9 && this.destroyTransportSession()
            }
        }
    };
    a.Session.prototype.allowOperation = function(c) {
        var f = true;
        if (this.m_disposed) f = false;
        else if (typeof c !== "undefined" && c !== null) switch (c) {
            case 0:
                if (this.m_sessionState !== 0 && this.m_sessionState !== 1) f = false;
                break;
            case 1:
                if (this.m_sessionState === 0) f = false;
                break;
            case 2:
                if (this.m_sessionState !== 3) f = false;
                break;
            case 3:
                if (this.m_sessionState !== 5) f = false;
                break;
            case 4:
                if (this.m_sessionState !== 8) f = false;
                break;
            case 5:
                if (this.m_sessionState !== 8) f = false;
                break;
            case 6:
                this.m_sessionProperties.reapplySubscriptions &&
                    this.m_sessionState === 7 || (f = false);
                break;
            case 7:
                f = true;
                break;
            default:
                f = false
        } else f = false;
        if (f) return null;
        else {
            f = new a.StringBuffer("Cannot perform operation ");
            f.append(a.SessionOperationDescription[c] || "");
            f.append(" while in state ").append(a.InternalSessionStateDescription[this.m_sessionState]);
            f.append(this.m_disposed ? "(already disposed)" : "");
            return f.toString()
        }
    };
    a.Session.prototype.updateReadonlySessionProps = function(c) {
        this.m_sessionProperties.vpnNameInUse = c.getVpnNameInUseValue() || "";
        var f =
            this.m_sessionProperties.virtualRouterName,
            o = c.getVridInUseValue() || "";
        this.m_sessionProperties.virtualRouterName = o;
        f !== "" && f !== o && this.sendEvent(new a.SessionEvent(b.VIRTUALROUTER_NAME_CHANGED, "Virtual router name is changed from " + f + " to " + o, null, 0, null, null));
        this.m_sessionProperties.p2pInboxBase = c.getP2PTopicValue() || "";
        this.m_sessionProperties.p2pInboxInUse = n.getP2PInboxTopic(this.m_sessionProperties.p2pInboxBase);
        this.m_capabilities = c.getRouterCapabilities()
    };
    a.Session.prototype.subscriptionUpdate =
        function(c, f, o, m, s, t) {
            var q;
            switch (s) {
                case 2:
                case 4:
                    q = "Cannot add subscription";
                    break;
                case 3:
                    q = "Cannot remove subscription";
                    break;
                case 1:
                    q = "Cannot register P2P inbox subscripiton";
                    break;
                case 7:
                case 8:
                    q = "Cannot update P2P inbox subscription";
                    break;
                default:
                    q = "Subscription update failed"
            }
            var u;
            switch (s) {
                case 2:
                case 4:
                    u = "Add subscription request timeout";
                    break;
                case 3:
                    u = "Remove subscription request timeout";
                    break;
                case 7:
                case 1:
                    u = "Add P2P inbox subscription timeout";
                    break;
                case 8:
                    u = "Remove P2P inbox subscription timeout";
                    break;
                default:
                    u = "Request timeout"
            }
            var v = s === 2 || s === 4 || s === 1 || s === 7,
                w = this.m_smfClient.nextCorrelationTag(),
                z = a.smf.SMPMessage.getSubscriptionMessage(w, c, v, f),
                B = this;
            v = this.m_smfClient.send(z);
            if (v !== 0) {
                if (v === 2) {
                    c = g.INSUFFICIENT_SPACE;
                    q += " - no space in transport"
                } else c = g.INVALID_SESSION_OPERATION;
                switch (s) {
                    case 1:
                        s = new a.SessionEvent(b.P2P_SUB_ERROR, q, null, c, null, null);
                        break;
                    case 7:
                    case 8:
                        s = new a.SessionEvent(b.PROPERTY_UPDATE_ERROR, q, null, c, null, null);
                        break;
                    default:
                        throw new a.OperationError(q,
                            c, v);
                }
                this.changeState(9);
                this.sendEvent(s)
            } else {
                this.updateTxStats(z);
                if (f) this.enqueueOutstandingCtrlReq(w, function() {
                    B.handleOperationTimeout(w, u)
                }, m || this.m_sessionProperties.readTimeoutInMsecs, s, o, t);
                if (s === 2 && this.m_sessionProperties.reapplySubscriptions) this.addToSubscriptionCache(c);
                else s === 3 && this.m_sessionProperties.reapplySubscriptions && this.removeFromSubscriptionCache(c)
            }
        };
    a.Session.prototype.handleSendMessage = function(c) {
        var f = c.getDestination();
        if (!(f !== null && r.notEmpty(f.getName()))) throw new a.OperationError("Message must have a valid Destination",
            g.TOPIC_MISSING);
        if (f = p.validateTopic(f.getName())) throw new a.OperationError(f, g.INVALID_TOPIC_SYNTAX, null);
        f = c.getDeliveryMode();
        if (f !== null && f !== a.MessageDeliveryModeType.DIRECT) throw new a.OperationError("AD messages are not supported", g.AD_MESSAGING_NOT_SUPPORTED);
        if (this.m_sessionProperties.generateSendTimestamps && (c.getSenderTimestamp() === null || c.hasAutoSenderTimestamp())) {
            c.setSenderTimestamp((new Date).getTime());
            c.setHasAutoSenderTimestamp(true)
        }
        if (this.m_sessionProperties.generateSequenceNumber &&
            (c.getSequenceNumber() === null || c.hasAutoSequenceNumber())) {
            c.setSequenceNumber(this.m_seqNum++);
            c.setHasAutoSequenceNumber(true)
        }
        this.m_sessionProperties.includeSenderId && c.getSenderId() === null && c.setSenderId(this.m_sessionProperties.clientName);
        f = this.m_smfClient.send(c);
        if (f !== 0)
            if (f === 2) throw new a.OperationError("Cannot send message - no space in transport", g.INSUFFICIENT_SPACE, f);
            else throw new a.OperationError("Cannot send message", g.INVALID_SESSION_OPERATION, f);
        else this.updateTxStats(c)
    };
    a.Session.prototype.enqueueOutstandingDataReq = function(c, f, o, m, s) {
        if (typeof c !== "undefined" && c !== null) {
            var t = this;
            o = setTimeout(function() {
                t.m_sessionStatistics.incStat(h.TX_REQUEST_TIMEOUT);
                try {
                    delete t.m_outstandingDataReqs[c]
                } catch (q) {}
                if (typeof f !== "undefined" && f !== null) {
                    var u = new a.SessionEvent(b.REQUEST_TIMEOUT, "Request timeout", null, g.TIMEOUT, null, null);
                    f(t, u, s)
                }
            }, o || this.m_sessionProperties.readTimeoutInMsecs);
            m = new a.OutstandingDataRequest(c, o, m, f, s);
            this.m_outstandingDataReqs[c] = m
        }
    };
    a.Session.prototype.cancelOutstandingDataReq =
        function(c) {
            if (this.m_outstandingDataReqs && typeof c !== "undefined" && c !== null) {
                var f = this.m_outstandingDataReqs[c];
                if (typeof f !== "undefined") {
                    if (typeof f.timer !== "undefined" && f.timer !== null) {
                        clearTimeout(f.timer);
                        f.timer = null
                    }
                    try {
                        delete this.m_outstandingDataReqs[c]
                    } catch (o) {}
                    return f
                }
            }
            return null
        };
    a.Session.prototype.enqueueOutstandingCtrlReq = function(c, f, o, m, s, t) {
        if (typeof c !== "undefined" && c !== null) {
            f = setTimeout(f, o || this.m_sessionProperties.readTimeoutInMsecs);
            m = new a.OutstandingCtrlRequest(c, f,
                m, s, t);
            this.m_outstandingCtrlReqs[c] = m
        }
    };
    a.Session.prototype.cancelOutstandingCtrlReq = function(c) {
        if (this.m_outstandingCtrlReqs && typeof c !== "undefined" && c !== null) {
            var f = this.m_outstandingCtrlReqs[c];
            if (typeof f !== "undefined") {
                if (typeof f.timer !== "undefined" && f.timer !== null) {
                    clearTimeout(f.timer);
                    f.timer = null
                }
                try {
                    delete this.m_outstandingCtrlReqs[c]
                } catch (o) {}
                return f
            }
        }
        return null
    };
    a.Session.prototype.addToSubscriptionCache = function(c) {
        if (this.m_subscriptionCache && typeof c !== "undefined" && c !== null) {
            var f =
                c.getKey();
            if (typeof this.m_subscriptionCache[f] === "undefined") {
                this.m_subscriptionCache[f] = c;
                this.m_subscriptionCacheCount++
            } else this.m_subscriptionCache[f] = c
        }
    };
    a.Session.prototype.removeFromSubscriptionCache = function(c) {
        if (this.m_subscriptionCache && typeof c !== "undefined" && c !== null) {
            c = c instanceof a.Topic ? c.getKey() : c;
            var f = this.m_subscriptionCache[c];
            if (typeof f !== "undefined") {
                try {
                    delete this.m_subscriptionCache[c] && this.m_subscriptionCacheCount--
                } catch (o) {}
                return f
            }
        }
        return null
    };
    a.Session.prototype.resetKeepAliveCounter =
        function() {
            this.m_keepAliveCounter = 0
        };
    a.Session.prototype.handleSmfMessage = function(c) {
        if (this.shallNotifyClient()) {
            var f, o;
            try {
                this.updateRxStats(c);
                var m = c.getSmfHeader(),
                    s = m.m_pm_respcode,
                    t = m.m_pm_respstr,
                    q;
                switch (m.m_smf_protocol) {
                    case 13:
                        if (s !== 0) {
                            o = a.ErrorResponseSubCodeMapper.getErrorSubCode(s, t);
                            f = new a.SessionEvent(b.REJECTED_MESSAGE_ERROR, t, s, o, null, null);
                            this.sendEvent(f)
                        } else this.handleDataMessage(c);
                        break;
                    case 12:
                        var u = m.m_pm_corrtag || "";
                        q = this.cancelOutstandingCtrlReq(u);
                        if (typeof q ===
                            "undefined" || q === null) {
                            this.changeState(9);
                            f = new a.SessionEvent(b.INTERNAL_ERROR, "Cannot find matching request for response: " + t, s, g.INTERNAL_ERROR, null, null);
                            this.sendEvent(f)
                        } else q.respRecvdCallback && q.respRecvdCallback(c);
                        break;
                    case 15:
                        u = m.m_pm_corrtag || "";
                        var v = a.Util.stripNullTerminate(c.EncodedUtf8Subscription);
                        q = this.cancelOutstandingCtrlReq(u);
                        if (this.m_sessionState === 6)
                            if (typeof q === "undefined" || q === null) {
                                this.changeState(9);
                                f = new a.SessionEvent(b.INTERNAL_ERROR, "Cannot find matching request for response: " +
                                    t, s, g.INTERNAL_ERROR, null, null);
                                this.sendEvent(f)
                            } else q.respRecvdCallback && q.respRecvdCallback(c);
                        else if (this.m_sessionState === 11)
                            if (typeof q === "undefined" || q === null) {
                                o = a.ErrorResponseSubCodeMapper.getErrorSubCode(s, t);
                                if (!(o === g.SUBSCRIPTION_ALREADY_PRESENT && this.m_sessionProperties.ignoreDuplicateSubscriptionError)) {
                                    f = new a.SessionEvent(b.REAPPLY_SUBSCRIPTION_ERROR, t, s, o, null, "Topic: " + v);
                                    this.sendEvent(f)
                                }
                            } else q.respRecvdCallback && q.respRecvdCallback(c);
                        else if (typeof q === "undefined" || q === null) this.handleSubscriptionUpdateError(s,
                            t, v, null);
                        else q.respRecvdCallback && q.respRecvdCallback(c, q);
                        break;
                    case 10:
                    case 11:
                        break;
                    default:
                        this.changeState(9);
                        if (m.m_smf_protocol === 20) {
                            f = new a.SessionEvent(b.PARSE_FAILURE, "Received message with unknown protocol", null, g.DATA_ERROR_OTHER, null, null);
                            this.sendEvent(f)
                        } else this.m_sessionStatistics.incStat(h.RX_DISCARD_SMF_UNKNOWN_ELEMENT)
                }
            } catch (w) {
                this.changeState(9);
                f = new a.SessionEvent(b.INTERNAL_ERROR, "Exception in handleSmfMessage: " + w, 0, g.INTERNAL_ERROR, null, null);
                this.sendEvent(f)
            }
        }
    };
    a.Session.prototype.handleDataMessage = function(c) {
        var f, o;
        if (this.m_sessionProperties.generateReceiveTimestamps) c.m_receiverTimestamp = (new Date).getTime();
        if (c.isReplyMessage()) {
            f = c.getCorrelationId();
            if (typeof f !== "undefined" && f !== null) {
                o = this.cancelOutstandingDataReq(f);
                if (o === null)
                    if (f.indexOf("#REQ") === 0) {
                        this.m_sessionStatistics.incStat(h.RX_REPLY_MSG_DISCARD);
                        return
                    } else {
                        if (f.indexOf(a.CacheRequestPrefix) === 0 && !(a.CacheMessageRxCBInfo && this.m_messageCallbackInfo instanceof a.CacheMessageRxCBInfo)) {
                            this.m_sessionStatistics.incStat(h.RX_REPLY_MSG_DISCARD);
                            return
                        }
                    }
                else {
                    this.m_sessionStatistics.incStat(h.RX_REPLY_MSG_RECVED);
                    o.replyReceivedCBFunction(this, c, o.userObject);
                    return
                }
            }
        }
        if (this.m_messageCallbackInfo) this.m_messageCallbackInfo.userObject ? this.m_messageCallbackInfo.messageRxCBFunction(this, c, this.m_messageCallbackInfo.userObject) : this.m_messageCallbackInfo.messageRxCBFunction(this, c)
    };
    a.Session.prototype.handleSmfParseError = function(c) {
        if (this.shallNotifyClient()) {
            this.changeState(9);
            this.sendEvent(new a.SessionEvent(b.PARSE_FAILURE, c.message,
                null, c.subcode || g.DATA_ERROR_OTHER, null, null))
        }
    };
    a.Session.prototype.handleTransportEvent = function(c) {
        var f, o = c.getInfoStr() || "",
            m = c.toString();
        if (!(c.getSessionEventCode() !== k.DESTROYED_NOTICE && !this.shallNotifyClient())) switch (c.getSessionEventCode()) {
            case k.UP_NOTICE:
                this.clearConnectTimer();
                this.m_lastKnownGoodTransport = this.m_transportProtocolHandler.getTransportProtocol();
                this.changeState(3);
                this.m_sessionId = c.getSessionId() || "";
                this.sendClientCtrl();
                break;
            case k.DESTROYED_NOTICE:
                f = this.m_sessionState;
                this.changeState(1);
                this.cleanupSession();
                if (f === 2 || f === 4)
                    if (this.m_transportProtocolHandler.shouldRetry()) {
                        this.m_transportProtocolHandler.handleConnectFailed(c);
                        this.connectInternal();
                        break
                    } f = b.DISCONNECTED;
                c = new a.SessionEvent(f, o, null, c.getResponseCode(), null, m);
                this.m_disposed || this.disconnectInternal();
                this.sendEvent(c);
                if (this.disposed) this.m_eventCallbackInfo = this.m_messageCallbackInfo = null;
                break;
            case k.CONNECTING:
                this.m_sessionState !== 2 && this.changeState(2);
                break;
            case k.CAN_ACCEPT_DATA:
                if (this.m_sessionState ===
                    11) this.reapplySubscriptions();
                else {
                    f = b.CAN_ACCEPT_DATA;
                    c = new a.SessionEvent(f, o, null, c.getResponseCode(), null, m);
                    this.sendEvent(c)
                }
                break;
            case k.CONNECTION_ERROR:
            case k.DATA_DECODE_ERROR:
            case k.PARSE_FAILURE:
                this.destroyTransportSession(o, c.getResponseCode())
        }
    };
    a.Session.prototype.sendClientCtrl = function() {
        var c;
        if (c = this.allowOperation(2)) {
            c = new a.SessionEvent(b.LOGIN_FAILURE, c, null, g.INVALID_SESSION_OPERATION, null, null);
            this.sendEvent(c)
        } else {
            this.changeState(4);
            c = a.smf.ClientCtrlMessage.getLogin(this.m_sessionProperties);
            var f = c.getSmfHeader().m_pm_corrtag || "",
                o = this,
                m = this.m_smfClient.send(c);
            if (m !== 0) {
                this.changeState(9);
                c = m === 2 ? new a.SessionEvent(b.LOGIN_FAILURE, "Cannot send client control - no space in transport", null, g.INSUFFICIENT_SPACE, null, null) : new a.SessionEvent(b.LOGIN_FAILURE, "Cannot send client ctrl", null, g.INVALID_SESSION_OPERATION, null, null);
                this.sendEvent(c)
            } else {
                this.updateTxStats(c);
                c = this.m_sessionProperties.readTimeoutInMsecs;
                if (this.m_sessionProperties.readTimeoutInMsecs - this.m_sessionProperties.transportDowngradeTimeoutInMsecs <
                    20) c = this.m_sessionProperties.transportDowngradeTimeoutInMsecs + 20;
                this.enqueueOutstandingCtrlReq(f, function() {
                    o.handleOperationTimeout(f, "Login request timeout")
                }, c, 0, null, function(s) {
                    o.handleClientCtrlResponse(s)
                })
            }
        }
    };
    a.Session.prototype.handleClientCtrlResponse = function(c) {
        var f = c.getResponse(),
            o = f.ResponseCode;
        f = f.ResponseString;
        if (o === 200) {
            if (this.m_sessionProperties.noLocal === true) {
                f = c.getRouterCapabilities();
                var m = true;
                m = f ? typeof f[a.CapabilityType.NO_LOCAL] === "boolean" ? f[a.CapabilityType.NO_LOCAL] :
                    false : false;
                if (!m) {
                    this.m_inReconnect = false;
                    this.changeState(9);
                    o = new a.SessionEvent(b.LOGIN_FAILURE, "No Local is not supported by the appliance", o, g.NO_LOCAL_NOT_SUPPORTED, null, null);
                    this.sendEvent(o);
                    return
                }
            }
            this.changeState(5);
            this.updateReadonlySessionProps(c);
            this.sendP2PInboxReg()
        } else {
            this.m_inReconnect = false;
            this.changeState(9);
            c = a.ErrorResponseSubCodeMapper.getErrorSubCode(o, f);
            o = new a.SessionEvent(b.LOGIN_FAILURE, f, o, c, null, null);
            this.sendEvent(o)
        }
    };
    a.Session.prototype.sendP2PInboxReg = function() {
        var c =
            this.allowOperation(3);
        if (c) this.sendEvent(new a.SessionEvent(b.P2P_SUB_ERROR, c, null, g.INVALID_SESSION_OPERATION, null, null));
        else {
            this.changeState(6);
            c = n.getP2PTopicSubscription(this.m_sessionProperties.p2pInboxBase);
            var f = this;
            this.subscriptionUpdate(new a.Topic(c), true, null, this.m_sessionProperties.readTimeoutInMsecs, 1, function(o) {
                f.handleP2PRegResponse(o)
            })
        }
    };
    a.Session.prototype.handleP2PRegResponse = function(c) {
        var f = c.getResponse();
        c = f.ResponseCode;
        f = f.ResponseString;
        var o;
        if (c === 200)
            if (this.m_inReconnect &&
                this.m_sessionProperties.reapplySubscriptions && this.m_subscriptionCache && this.m_subscriptionCacheCount > 0) {
                this.changeState(7);
                this.clearSubscriptionCacheKeys();
                this.m_subscriptionCacheKeys = [];
                for (o in this.m_subscriptionCache) this.m_subscriptionCache.hasOwnProperty(o) && this.m_subscriptionCacheKeys.push(o);
                this.reapplySubscriptions()
            } else {
                this.m_inReconnect = false;
                this.changeState(8);
                this.scheduleKeepAlive();
                c = new a.SessionEvent(b.UP_NOTICE, l("Session is up (transport:{0})", this.m_transportProtocolHandler),
                    c, 0, null, null);
                this.sendEvent(c)
            }
        else {
            this.m_inReconnect = false;
            this.changeState(9);
            o = a.ErrorResponseSubCodeMapper.getErrorSubCode(c, f);
            c = new a.SessionEvent(b.P2P_SUB_ERROR, f, c, o, null, null);
            this.sendEvent(c)
        }
    };
    a.Session.prototype.sendUpdateP2PInboxReg = function(c, f, o, m) {
        var s = this.allowOperation(4);
        s ? this.sendEvent(new a.SessionEvent(b.PROPERTY_UPDATE_ERROR, s, null, g.INVALID_SESSION_OPERATION, o, null)) : this.subscriptionUpdate(new a.Topic(f), true, null, this.m_sessionProperties.readTimeoutInMsecs, c ? 7 : 8,
            m)
    };
    a.Session.prototype.handleOperationTimeout = function(c, f) {
        this.m_inReconnect = false;
        try {
            delete this.m_outstandingCtrlReqs[c]
        } catch (o) {}
        if (this.shallNotifyClient()) {
            this.changeState(9);
            this.sendEvent(new a.SessionEvent(b.REQUEST_TIMEOUT, f, null, g.TIMEOUT, null, null))
        }
    };
    a.Session.prototype.scheduleKeepAlive = function() {
        var c = this;
        this.m_keepAliveTimer && clearInterval(this.m_keepAliveTimer);
        this.m_kaWatchdog && clearInterval(this.m_kaWatchdog);
        c.m_kaWatchdog = 0;
        c.m_kaWatchdogCount = 0;
        this.m_keepAliveTimer =
            setInterval(function() {
                try {
                    c.sendKeepAlive();
                    c.m_kaWatchdogCount = 0
                } catch (f) {}
            }, this.m_sessionProperties.keepAliveIntervalInMsecs);
        this.m_kaWatchdog = setInterval(function() {
            c.m_kaWatchdogCount++;
            c.m_kaWatchdogCount >= 2 && c.scheduleKeepAlive()
        }, this.m_sessionProperties.keepAliveIntervalInMsecs * 3)
    };
    a.Session.prototype.sendKeepAlive = function() {
        var c;
        if (c = this.allowOperation(4)) {
            if (this.shallNotifyClient()) {
                c = new a.SessionEvent(b.KEEP_ALIVE_ERROR, c, null, g.INVALID_SESSION_OPERATION, null, null);
                this.sendEvent(c)
            }
        } else if (this.m_keepAliveCounter >=
            this.m_sessionProperties.keepAliveIntervalsLimit) {
            this.changeState(9);
            c = new a.SessionEvent(b.KEEP_ALIVE_ERROR, "Exceed maximum keep alive intervals limit", null, g.KEEP_ALIVE_FAILURE, null, null);
            this.sendEvent(c)
        } else {
            c = new a.smf.KeepAliveMessage;
            var f = this.m_smfClient,
                o = f.getClientStats().msgWritten,
                m = f.getClientStats().bytesWritten;
            if (this.m_smfClient.send(c, true) !== 0) {
                if (this.shallNotifyClient()) {
                    this.changeState(9);
                    c = new a.SessionEvent(b.KEEP_ALIVE_ERROR, "Cannot send keep alive message", null, g.COMMUNICATION_ERROR,
                        null, null);
                    this.sendEvent(c)
                }
            } else {
                this.updateTxStats(c);
                this.m_kaStats.lastMsgWritten === o && this.m_kaStats.lastBytesWritten < m || this.m_keepAliveCounter++;
                this.m_kaStats.lastBytesWritten = f.getClientStats().bytesWritten;
                this.m_kaStats.lastMsgWritten = f.getClientStats().msgWritten
            }
        }
    };
    a.Session.prototype.reapplySubscriptions = function() {
        if (this.m_sessionState !== 11) {
            var c = this.allowOperation(6);
            if (c) {
                this.m_inReconnect = false;
                this.clearSubscriptionCacheKeys();
                this.sendEvent(new a.SessionEvent(b.SUBSCRIPTION_ERROR,
                    c, null, g.INVALID_SESSION_OPERATION, null, null));
                return
            }
            this.changeState(11)
        }
        var f = this;
        c = function(s) {
            f.handleApplySubscriptionResponse(s)
        };
        if (this.m_subscriptionCacheKeys) {
            var o = null;
            try {
                for (; this.m_subscriptionCacheKeys.length > 0;) {
                    o = this.m_subscriptionCacheKeys[0];
                    this.m_subscriptionCacheKeys.length === 1 ? this.subscriptionUpdate(this.m_subscriptionCache[o], true, null, this.m_sessionProperties.readTimeoutInMsecs, 4, c) : this.subscriptionUpdate(this.m_subscriptionCache[o], false, null, this.m_sessionProperties.readTimeoutInMsecs,
                        4, null);
                    this.m_subscriptionCacheKeys.shift()
                }
            } catch (m) {
                if (!(m.name && m.name === "OperationError" && m.subcode === g.INSUFFICIENT_SPACE)) throw m;
            }
        }
    };
    a.Session.prototype.handleApplySubscriptionResponse = function(c) {
        var f = c.getResponse(),
            o = f.ResponseCode;
        f = f.ResponseString;
        this.m_inReconnect = false;
        this.clearSubscriptionCacheKeys();
        if (o !== 200) {
            var m = a.Util.stripNullTerminate(c.EncodedUtf8Subscription);
            c = a.ErrorResponseSubCodeMapper.getErrorSubCode(o, f);
            if (!(c === g.SUBSCRIPTION_ALREADY_PRESENT && this.m_sessionProperties.ignoreDuplicateSubscriptionError)) {
                f =
                    new a.SessionEvent(b.REAPPLY_SUBSCRIPTION_ERROR, f, o, c, null, "Topic: " + m);
                this.sendEvent(f)
            }
        }
        this.changeState(8);
        this.scheduleKeepAlive();
        f = new a.SessionEvent(b.UP_NOTICE, l("Session is up (transport:{0})", this.m_transportProtocolHandler.getTransportProtocol()), o, 0, null, null);
        this.sendEvent(f)
    };
    a.Session.prototype.handleSubscriptionUpdateResponse = function(c, f) {
        var o = c.getResponse(),
            m = o.ResponseCode;
        o = o.ResponseString;
        if (m === 200) {
            m = new a.SessionEvent(b.SUBSCRIPTION_OK, o, m, 0, f.correlationKey, null);
            this.sendEvent(m)
        } else {
            var s =
                a.Util.stripNullTerminate(c.EncodedUtf8Subscription);
            this.handleSubscriptionUpdateError(m, o, s, f)
        }
    };
    a.Session.prototype.handleSubscriptionUpdateError = function(c, f, o, m) {
        var s = a.ErrorResponseSubCodeMapper.getErrorSubCode(c, f),
            t = b.SUBSCRIPTION_ERROR,
            q = null;
        if (m !== null) q = m.correlationKey;
        if (s === g.SUBSCRIPTION_ALREADY_PRESENT && this.m_sessionProperties.ignoreDuplicateSubscriptionError || s === g.SUBSCRIPTION_NOT_FOUND && this.m_sessionProperties.ignoreSubscriptionNotFoundError) {
            if (m !== null) {
                c = new a.SessionEvent(b.SUBSCRIPTION_OK,
                    f, c, 0, q, null);
                this.sendEvent(c)
            }
        } else {
            if (s === g.SUBSCRIPTION_ALREADY_PRESENT || s === g.SUBSCRIPTION_NOT_FOUND) c = new a.SessionEvent(t, f, c, s, q, "Topic: " + o);
            else if (s === g.SUBSCRIPTION_ATTRIBUTES_CONFLICT || s === g.SUBSCRIPTION_INVALID || s === g.SUBSCRIPTION_ACL_DENIED || s === g.SUBSCRIPTION_TOO_MANY) {
                this.removeFromSubscriptionCache(o);
                c = new a.SessionEvent(t, f, c, s, q, "Topic: " + o)
            } else {
                this.removeFromSubscriptionCache(o);
                c = new a.SessionEvent(t, f, c, g.SUBSCRIPTION_ERROR_OTHER, q, "Topic: " + o)
            }
            this.sendEvent(c)
        }
    };
    a.Session.prototype.getEventCBInfo =
        function() {
            return this.m_eventCallbackInfo
        };
    a.Session.prototype.setEventCBInfo = function(c) {
        this.m_eventCallbackInfo = c
    };
    a.Session.prototype.getMessageCBInfo = function() {
        return this.m_messageCallbackInfo
    };
    a.Session.prototype.setMessageCBInfo = function(c) {
        this.m_messageCallbackInfo = c
    };
    a.Session.prototype.cleanupSession = function() {
        this.m_sessionId = null;
        this.m_inReconnect = false;
        if (typeof this.m_keepAliveTimer !== "undefined" && this.m_keepAliveTimer !== null) {
            clearInterval(this.m_keepAliveTimer);
            clearInterval(this.m_kaWatchdog);
            this.m_keepAliveTimer = null
        }
        this.resetKeepAliveCounter();
        var c;
        if (this.m_outstandingCtrlReqs)
            for (c in this.m_outstandingCtrlReqs) this.m_outstandingCtrlReqs.hasOwnProperty(c) && this.cancelOutstandingCtrlReq(c);
        if (this.m_outstandingDataReqs) {
            var f;
            for (c in this.m_outstandingDataReqs)
                if (this.m_outstandingDataReqs.hasOwnProperty(c)) {
                    f = this.cancelOutstandingDataReq(c);
                    if (f !== null && typeof f.reqFailedCBFunction !== "undefined" && f.reqFailedCBFunction !== null) {
                        var o = new a.SessionEvent(b.REQUEST_ABORTED, "Request aborted",
                            null, g.SESSION_NOT_CONNECTED, null, null);
                        f.reqFailedCBFunction(this, o, f.userObject)
                    }
                }
        }
    };
    a.Session.prototype.destroyTransportSession = function(c, f) {
        if (typeof this.m_smfClient !== "undefined" && this.m_smfClient !== null) {
            var o = this.m_smfClient;
            this.m_smfClient = null;
            o.destroy(true, c, f)
        }
    };
    a.Session.prototype.clearSubscriptionCacheKeys = function() {
        if (this.m_subscriptionCacheKeys) {
            try {
                for (; this.m_subscriptionCacheKeys.length > 0;) this.m_subscriptionCacheKeys.shift()
            } catch (c) {}
            this.m_subscriptionCacheKeys = null
        }
    };
    a.Session.prototype.getTransportInfo = function() {
        if (typeof this.m_smfClient === "undefined" || this.m_smfClient !== null) return "Not connected.";
        return this.m_smfClient.getTransportSessionInfoStr()
    };
    a.Session.prototype.getSessionIdForLogging = function() {
        return " (sessionId=" + (r.notEmpty(this.m_sessionId) ? a.Util.formatHexString(this.m_sessionId) : "N/A") + ")"
    };
    a.ResponseErrorMap = function(c, f, o) {
        this.respErrorCode = c;
        this.respErrorStr = f;
        this.errSubCode = o
    };
    a.ErrorResponseSubCodeMapper = {};
    a.ErrorResponseSubCodeMapper.getErrorSubCode =
        function(c, f) {
            if (c === a.ErrorResponseSubCodeMapper.ResponseCode.E200_OK) return 0;
            var o, m, s = a.ErrorResponseSubCodeMapper.ResponseErrorMapping,
                t = s.length;
            for (o = 0; o < t; o++) {
                m = s[o];
                if (m.respErrorCode === c)
                    if (m.respErrorStr === null || f.toLowerCase().indexOf(m.respErrorStr.toLowerCase()) >= 0) return m.errSubCode
            }
            o = new a.StringBuffer("Cannot find error subcode for response error code=");
            o.append(c).append(", response string");
            o.append(f);
            return g.UNKNOWN_ERROR
        };
    a.ErrorResponseSubCodeMapper.ResponseCode = {
        E200_OK: 200,
        E400: 400,
        E401: 401,
        E403: 403,
        E404: 404,
        E503: 503,
        E507: 507
    };
    a.ErrorResponseSubCodeMapper.ResponseErrorStr = {
        ER_XML_PARSE_ERROR: "xml parse error",
        ER_DOC_TOO_LARGE: "document is too large",
        ER_MSG_TOO_LARGE: "message too long",
        ER_TOO_MANY_CLIENTS: "too many clients",
        ER_SUB_DELETE_IN_PROGRESS: "subscriber delete in progress",
        ER_INVALID_VIRTUAL_IP: "invalid virtual router address",
        ER_SUB_ALREADY_PRESENT: "subscription already exists",
        ER_SUB_NOT_FOUND: "subscription not found",
        ER_SUB_PARSE_ERROR: "subscription parse error",
        ER_SUB_MAX_NUMBER_EXCEEDED: "max num subscriptions exceeded",
        ER_TOPIC_PARSE_ERROR: "topic parse error",
        ER_NOT_ENOUGH_SPACE: "not enough space",
        ER_MSG_VPN_NOT_ALLOWED: "message vpn not allowed",
        ER_MSG_VPN_UNAVAILABLE: "message vpn unavailable",
        ER_CLIENT_USERNAME_IS_SHUTDOWN: "client username is shutdown",
        ER_DYNAMIC_CLIENTS_NOT_ALLOWED: "dynamic clients not allowed",
        ER_CLIENT_NAME_ALREADY_IN_USE: "client name already in use",
        ER_CLIENT_NAME_PARSE_ERROR: "client name parse error",
        ER_FORBIDDEN: "Forbidden",
        ER_SUBSCRIPTION_ACL_DENIED: "Subscription ACL Denied",
        ER_PUBLISH_ACL_DENIED: "Publish ACL Denied",
        ER_SUBSCRIPTION_ATTRIBUTES_CONFLICT_WITH_EXISTING_SUBSCRIPTION: "Subscription Attributes Conflict With Existing Subscription",
        ER_INACTIVITY_TIMEOUT: "Inactivity Timeout",
        ER_UNKNOWN_TRANSPORT_SESSION_ID: "Unknown Transport Session Identifier",
        ER_REPLICATION_IS_STANDBY: "Replication Is Standby"
    };
    a.ErrorResponseSubCodeMapper.ResponseErrorMapping = function() {
        var c = a.ErrorResponseSubCodeMapper.ResponseCode,
            f = a.ErrorResponseSubCodeMapper.ResponseErrorStr;
        return [new a.ResponseErrorMap(c.E401,
                null, g.LOGIN_FAILURE), new a.ResponseErrorMap(c.E404, null, g.LOGIN_FAILURE), new a.ResponseErrorMap(c.E403, f.ER_INVALID_VIRTUAL_IP, g.INVALID_VIRTUAL_ADDRESS), new a.ResponseErrorMap(c.E403, f.ER_MSG_VPN_NOT_ALLOWED, g.MESSAGE_VPN_NOT_ALLOWED), new a.ResponseErrorMap(c.E403, f.ER_CLIENT_USERNAME_IS_SHUTDOWN, g.CLIENT_USERNAME_IS_SHUTDOWN), new a.ResponseErrorMap(c.E403, f.ER_DYNAMIC_CLIENTS_NOT_ALLOWED, g.DYNAMIC_CLIENTS_NOT_ALLOWED), new a.ResponseErrorMap(c.E403, f.ER_CLIENT_NAME_ALREADY_IN_USE, g.CLIENT_NAME_ALREADY_IN_USE),
            new a.ResponseErrorMap(c.E503, f.ER_SUB_DELETE_IN_PROGRESS, g.CLIENT_DELETE_IN_PROGRESS), new a.ResponseErrorMap(c.E503, f.ER_TOO_MANY_CLIENTS, g.TOO_MANY_CLIENTS), new a.ResponseErrorMap(c.E503, f.ER_MSG_VPN_UNAVAILABLE, g.MESSAGE_VPN_UNAVAILABLE), new a.ResponseErrorMap(c.E400, f.ER_CLIENT_NAME_PARSE_ERROR, g.CLIENT_NAME_INVALID), new a.ResponseErrorMap(c.E403, f.ER_FORBIDDEN, g.CLIENT_ACL_DENIED), new a.ResponseErrorMap(c.E400, f.ER_XML_PARSE_ERROR, g.XML_PARSE_ERROR), new a.ResponseErrorMap(c.E400, f.ER_DOC_TOO_LARGE,
                g.MESSAGE_TOO_LARGE), new a.ResponseErrorMap(c.E400, f.ER_MSG_TOO_LARGE, g.MESSAGE_TOO_LARGE), new a.ResponseErrorMap(c.E400, f.ER_TOPIC_PARSE_ERROR, g.INVALID_TOPIC_SYNTAX), new a.ResponseErrorMap(c.E403, f.ER_PUBLISH_ACL_DENIED, g.PUBLISH_ACL_DENIED), new a.ResponseErrorMap(c.E400, f.ER_SUB_ALREADY_PRESENT, g.SUBSCRIPTION_ALREADY_PRESENT), new a.ResponseErrorMap(c.E400, f.ER_SUB_NOT_FOUND, g.SUBSCRIPTION_NOT_FOUND), new a.ResponseErrorMap(c.E400, f.ER_SUB_PARSE_ERROR, g.SUBSCRIPTION_INVALID), new a.ResponseErrorMap(c.E400,
                f.ER_SUB_MAX_NUMBER_EXCEEDED, g.SUBSCRIPTION_TOO_MANY), new a.ResponseErrorMap(c.E400, f.ER_NOT_ENOUGH_SPACE, g.OUT_OF_RESOURCES), new a.ResponseErrorMap(c.E403, f.ER_SUBSCRIPTION_ACL_DENIED, g.SUBSCRIPTION_ACL_DENIED), new a.ResponseErrorMap(c.E400, f.ER_SUBSCRIPTION_ATTRIBUTES_CONFLICT_WITH_EXISTING_SUBSCRIPTION, g.SUBSCRIPTION_ATTRIBUTES_CONFLICT), new a.ResponseErrorMap(c.E400, f.ER_INACTIVITY_TIMEOUT, g.INACTIVITY_TIMEOUT), new a.ResponseErrorMap(c.E400, f.ER_UNKNOWN_TRANSPORT_SESSION_ID, g.UNKNOWN_TRANSPORT_SESSION_ID),
            new a.ResponseErrorMap(c.E403, f.ER_REPLICATION_IS_STANDBY, g.REPLICATION_IS_STANDBY)
        ]
    }();
    a.OutstandingDataRequest = function(c, f, o, m, s) {
        this.correlationId = c;
        this.timer = f;
        this.replyReceivedCBFunction = o;
        this.reqFailedCBFunction = m;
        this.userObject = s
    };
    a.OutstandingCtrlRequest = function(c, f, o, m, s) {
        this.correlationTag = c;
        this.timer = f;
        this.requestType = o;
        this.correlationKey = m;
        this.respRecvdCallback = s
    };
    a.CacheRequestPrefix = "#CRQ"
})(solace);
(function(a) {
    function g(d, h, e) {
        h = h;
        if (d.length - h < 10) return false;
        var i = new a.TransportSmfMessage;
        i.setSmfHeader(e);
        var l = a.Convert.strToInt16(d.substr(h, 2));
        h += 2;
        i.UH = j(l, 15, 1);
        i.MessageType = j(l, 8, 7);
        l = j(l, 0, 8);
        i.TsHeaderLength = l;
        i.SessionId = d.substr(h, 8);
        h += 8;
        if (i.MessageType === 1) {
            var c = a.Convert.strToInt8(d.substr(h, 1));
            h++;
            if (d.length - h < c) return false;
            i.RouterTag = d.substr(h, c)
        }
        i.PayloadLength = e.m_payloadLength === 4294967295 ? e.m_payloadLength : e.m_payloadLength - l;
        return i
    }

    function b(d) {
        function h(f,
            o, m) {
            m = m();
            typeof m !== "undefined" && m !== null && e.addField(f, a.SDTField.create(o, m))
        }
        var e = new a.SDTMapContainer;
        h("ci", a.SDTFieldType.STRING, function() {
            return d.getCorrelationId()
        });
        h("mi", a.SDTFieldType.STRING, function() {
            return d.getApplicationMessageId()
        });
        h("mt", a.SDTFieldType.STRING, function() {
            return d.getApplicationMessageType()
        });
        h("rt", a.SDTFieldType.DESTINATION, function() {
            return d.getReplyTo()
        });
        h("si", a.SDTFieldType.STRING, function() {
            return d.getSenderId()
        });
        h("sn", a.SDTFieldType.INT64, function() {
            return d.getSequenceNumber()
        });
        h("ts", a.SDTFieldType.INT64, function() {
            return d.getSenderTimestamp()
        });
        var i = new a.SDTMapContainer;
        d.getUserPropertyMap() && i.addField("p", a.SDTField.create(a.SDTFieldType.MAP, d.getUserPropertyMap()));
        e.getKeys().length > 0 && i.addField("h", a.SDTField.create(a.SDTFieldType.MAP, e));
        var l = null,
            c = 0;
        switch (d.getType()) {
            case a.MessageType.BINARY:
                c |= 128;
                break;
            case a.MessageType.MAP:
                c |= 10;
                (l = a.sdt.Codec.encodeSdt(d.m_structuredContainer)) && d.setBinaryAttachment(l);
                break;
            case a.MessageType.STREAM:
                c |= 11;
                (l = a.sdt.Codec.encodeSdt(d.m_structuredContainer)) &&
                d.setBinaryAttachment(l);
                break;
            case a.MessageType.TEXT:
                c |= 7;
                (l = a.sdt.Codec.encodeSdt(d.m_structuredContainer)) && d.setBinaryAttachment(l)
        }
        l = 0;
        if (d.isReplyMessage()) l |= 128;
        l = a.SDTField.create(a.SDTFieldType.BYTEARRAY, String.fromCharCode(c, l));
        c = new a.SDTStreamContainer;
        c.addField(l);
        c.addField(a.SDTField.create(a.SDTFieldType.MAP, i));
        i = new a.smf.BinaryMetaBlock;
        i.Type = 0;
        i.Payload = a.sdt.Codec.encodeSdt(a.SDTField.create(a.SDTFieldType.STREAM, c));
        d.setBinaryMetadataChunk(i)
    }

    function k(d, h, e, i) {
        if (typeof e !==
            "undefined" && e !== null && e.length > 0) {
            var l = new a.smf.Codec.ParamParse.ContentSummaryElement;
            l.Type = i;
            l.Length = e.length;
            d.push(l);
            h.push(e)
        }
    }
    a.smf = a.smf || {};
    var j = function(d, h, e) {
            return d >>> h & (1 << e) - 1
        },
        n = function(d, h, e, i) {
            i = (1 << i) - 1;
            h = (h & i) << e;
            d &= ~(i << e);
            return d | h
        };
    a.smf.Codec = {
        bits: j,
        setBits: n
    };
    a.smf.Codec.isSmfHeaderAvailable = function(d, h) {
        if (d.length - h < 12) return false;
        if ((a.Convert.strToInt8(d.substr(h + 0, 1)) & 7) !== 3) return false;
        return true
    };
    a.smf.Codec.isSmfAvailable = function(d, h) {
        if (!a.smf.Codec.isSmfHeaderAvailable(d,
                h)) return false;
        var e = d.length - h;
        return a.Convert.strToUInt32(d.substr(h + 8, 4)) <= e
    };
    a.smf.Codec.parseSmfAt = function(d, h) {
        if (!this.isSmfHeaderAvailable(d, h)) return false;
        var e = h,
            i = a.Convert.strToInt32(d.substr(e + 0, 4)),
            l = a.Convert.strToUInt32(d.substr(e + 4, 4)),
            c = a.Convert.strToUInt32(d.substr(e + 8, 4)),
            f = new a.smf.SMFHeader;
        f.m_smf_di = j(i, 31, 1);
        f.m_smf_elidingeligible = j(i, 30, 1);
        f.m_smf_dto = j(i, 29, 1);
        f.m_smf_adf = j(i, 28, 1);
        f.m_smf_version = j(i, 24, 3);
        f.m_smf_uh = j(i, 22, 2);
        f.m_smf_protocol = j(i, 16, 6);
        f.m_smf_priority =
            j(i, 12, 4);
        f.m_smf_ttl = j(i, 0, 8);
        i = c - l;
        if (i < 0) return false;
        f.setMessageSizes(l, i);
        for (e += 12; e < h + l;) {
            c = a.Convert.strToInt8(d.substr(e, 1));
            e++;
            j(c, 6, 2);
            var o = 0,
                m = 0;
            i = 0;
            if (j(c, 5, 1) !== 0) {
                o = j(c, 2, 3);
                m = j(c, 0, 2) + 1;
                i = m - 1;
                if (m <= 0) return false;
                switch (o) {
                    case 0:
                        f.m_pm_corrtag = a.Convert.strToInt24(d.substr(e, 3));
                        break;
                    case 1:
                        c = this.ParamParse.parseTopicQueueOffsets(d, e);
                        f.m_pm_queue_offset = c[0];
                        f.m_pm_queue_len = c[1];
                        break;
                    case 2:
                        c = this.ParamParse.parseTopicQueueOffsets(d, e);
                        f.m_pm_topic_offset = c[0];
                        f.m_pm_topic_len =
                            c[1]
                }
            } else {
                o = j(c, 0, 5);
                if (o === 0) break;
                m = a.Convert.strToInt8(d.substr(e, 1));
                e++;
                if (m === 0) {
                    m = a.Convert.strToUInt32(d.substr(e, 4));
                    e += 4;
                    i = m - 6
                } else i = m - 2;
                if (m <= 0) return false;
                switch (o) {
                    case 3:
                        f.m_pm_msg_priority = a.Convert.strToInt8(d.substr(e, 1));
                        break;
                    case 4:
                        f.m_pm_userdata = d.substr(e, i);
                        break;
                    case 6:
                        f.m_pm_username = a.base64_decode(d.substr(e, i));
                        break;
                    case 7:
                        f.m_pm_password = a.base64_decode(d.substr(e, i));
                        break;
                    case 8:
                        c = this.ParamParse.parseResponseParam(d, e, i);
                        f.m_pm_respcode = c[0];
                        f.m_pm_respstr = c[1];
                        break;
                    case 16:
                        f.m_pm_deliverymode = this.ParamParse.parseDeliveryMode(d, e);
                        break;
                    case 17:
                        f.m_pm_ad_msgid = 0;
                        break;
                    case 18:
                        f.m_pm_ad_prevmsgid = 0;
                        break;
                    case 19:
                        f.m_pm_ad_redelflag = true;
                        break;
                    case 20:
                        f.m_pm_ad_ttl = 0;
                        break;
                    case 22:
                        f.m_pm_content_summary = this.ParamParse.parseContentSummary(d, e, i);
                        break;
                    case 23:
                        f.m_pm_ad_flowid = 0;
                        break;
                    case 24:
                        f.m_pm_tr_topicname_bytes = d.substr(e, i - 1);
                        break;
                    case 25:
                        f.m_pm_ad_flowredelflag = true
                }
            }
            e += i
        }
        return f
    };
    a.smf.Codec.ParamParse = function() {
        var d = function() {
                var e = [];
                e[0] =
                    a.MessageDeliveryModeType.NON_PERSISTENT;
                e[1] = a.MessageDeliveryModeType.PERSISTENT;
                e[2] = a.MessageDeliveryModeType.DIRECT;
                return e
            }(),
            h = function() {
                var e = [];
                e[a.MessageDeliveryModeType.NON_PERSISTENT] = a.Convert.int8ToStr(0);
                e[a.MessageDeliveryModeType.PERSISTENT] = a.Convert.int8ToStr(1);
                e[a.MessageDeliveryModeType.DIRECT] = a.Convert.int8ToStr(2);
                return e
            }();
        return {
            parseTopicQueueOffsets: function(e, i) {
                var l = [];
                l[0] = a.Convert.strToInt8(e.substr(i, 1));
                l[1] = a.Convert.strToInt8(e.substr(i + 1, 1));
                return l
            },
            parseResponseParam: function(e, i, l) {
                var c = [];
                c[0] = a.Convert.strToInt32(e.substr(i, 4));
                l = l - 4;
                c[1] = l > 0 ? e.substr(i + 4, l) : "";
                return c
            },
            parseDeliveryMode: function(e, i) {
                var l = a.Convert.strToInt8(e.substr(i, 1));
                return d[l] || a.MessageDeliveryModeType.DIRECT
            },
            encDeliveryMode: function(e) {
                return h[e] || h[a.MessageDeliveryModeType.DIRECT]
            },
            ContentSummaryType: {
                XML_META: 0,
                XML_PAYLOAD: 1,
                BINARY_ATTACHMENT: 2,
                CID_LIST: 3,
                BINARY_METADATA: 4
            },
            ContentSummaryElement: function() {
                this.Type = null;
                this.Length = this.Position = 0
            },
            parseContentSummary: function(e,
                i, l) {
                for (var c = [], f = 0, o = i; o < i + l;) {
                    var m = a.Convert.strToInt8(e.substr(o, 1)),
                        s = j(m, 4, 4),
                        t = j(m, 0, 4);
                    m = 0;
                    switch (t) {
                        case 2:
                            m = a.Convert.strToInt8(e.substr(o + 1, 1));
                            break;
                        case 3:
                            m = a.Convert.strToInt16(e.substr(o + 1, 2));
                            break;
                        case 4:
                            m = a.Convert.strToInt24(e.substr(o + 1, 3));
                            break;
                        case 5:
                            m = a.Convert.strToInt32(e.substr(o + 1, 4))
                    }
                    o += t;
                    t = new this.ContentSummaryElement;
                    t.Position = f;
                    t.Length = m;
                    f += m;
                    switch (s) {
                        case 0:
                            t.Type = this.ContentSummaryType.XML_META;
                            break;
                        case 1:
                            t.Type = this.ContentSummaryType.XML_PAYLOAD;
                            break;
                        case 2:
                            t.Type = this.ContentSummaryType.BINARY_ATTACHMENT;
                            break;
                        case 3:
                            t.Type = this.ContentSummaryType.CID_LIST;
                            break;
                        case 4:
                            t.Type = this.ContentSummaryType.BINARY_METADATA
                    }
                    c.push(t)
                }
                return c
            },
            encContentSummary: function(e) {
                for (var i = [], l = 0; l < e.length; l++) {
                    var c = e[l],
                        f = "",
                        o = 0;
                    o = n(o, c.Type, 4, 4);
                    if (c.Length <= 255) {
                        o = n(o, 2, 0, 4);
                        f = a.Convert.int8ToStr(c.Length)
                    } else if (c.Length <= 65535) {
                        o = n(o, 3, 0, 4);
                        f = a.Convert.int16ToStr(c.Length)
                    } else if (c.Length <= 16777215) {
                        o = n(o, 4, 0, 4);
                        f = a.Convert.int24ToStr(c.Length)
                    } else {
                        o =
                            n(o, 5, 0, 4);
                        f = a.Convert.int32ToStr(c.Length)
                    }
                    i.push(a.Convert.int8ToStr(o));
                    i.push(f)
                }
                return i.join("")
            },
            encSmfParam: function(e, i, l) {
                var c = [],
                    f = 0,
                    o = 0;
                f = n(f, e, 6, 2);
                f = n(f, i, 0, 5);
                c.push(a.Convert.int8ToStr(f));
                if (l.length <= 253) {
                    o = l.length + 2;
                    c.push(a.Convert.int8ToStr(o))
                } else {
                    o = 0;
                    c.push(a.Convert.int8ToStr(o));
                    c.push(a.Convert.int32ToStr(l.length + 6))
                }
                c.push(l);
                return c.join("")
            },
            encLightSmfParam: function(e, i, l) {
                var c = [],
                    f = 0;
                f = n(f, e, 6, 2);
                f = n(f, 1, 5, 1);
                f = n(f, i, 2, 3);
                f = n(f, l.length, 0, 2);
                c.push(a.Convert.int8ToStr(f));
                c.push(l);
                return c.join("")
            }
        }
    }();
    a.smf.Codec.encSmf = function(d) {
        var h = [],
            e = 0;
        if (d.m_smf_di) e = n(e, d.m_smf_di, 31, 1);
        if (d.m_smf_elidingeligible) e = n(e, d.m_smf_elidingeligible, 30, 1);
        if (d.m_smf_dto) e = n(e, d.m_smf_dto, 29, 1);
        if (d.m_smf_adf) e = n(e, d.m_smf_adf, 28, 1);
        if (d.m_smf_version) e = n(e, d.m_smf_version, 24, 3);
        if (d.m_smf_uh) e = n(e, d.m_smf_uh, 22, 2);
        if (d.m_smf_protocol) e = n(e, d.m_smf_protocol, 16, 6);
        if (d.m_smf_priority) e = n(e, d.m_smf_priority, 12, 4);
        if (d.m_smf_ttl) e = n(e, d.m_smf_ttl, 0, 8);
        var i = [];
        d.m_pm_tr_topicname_bytes &&
            i.push(a.smf.Codec.ParamParse.encSmfParam(2, 24, d.m_pm_tr_topicname_bytes + "\u0000"));
        var l = 0;
        if (d.m_pm_queue_len) {
            l = 0;
            l = n(l, d.m_pm_queue_offset, 8, 8);
            l = n(l, d.m_pm_queue_len, 0, 8);
            i.push(a.smf.Codec.ParamParse.encLightSmfParam(0, 2, a.Convert.int16ToStr(l)))
        }
        if (d.m_pm_topic_len) {
            l = 0;
            l = n(l, d.m_pm_topic_offset, 8, 8);
            l = n(l, d.m_pm_topic_len, 0, 8);
            i.push(a.smf.Codec.ParamParse.encLightSmfParam(0, 1, a.Convert.int16ToStr(l)))
        }
        d.m_pm_corrtag !== null && i.push(a.smf.Codec.ParamParse.encLightSmfParam(0, 0, a.Convert.int24ToStr(d.m_pm_corrtag)));
        d.m_pm_msg_priority !== null && i.push(a.smf.Codec.ParamParse.encSmfParam(0, 3, a.Convert.int8ToStr(d.m_pm_msg_priority)));
        d.m_pm_userdata !== null && d.m_pm_userdata !== "" && i.push(a.smf.Codec.ParamParse.encSmfParam(0, 4, d.m_pm_userdata));
        if (d.m_pm_username) {
            l = a.base64_encode(d.m_pm_username);
            i.push(a.smf.Codec.ParamParse.encSmfParam(0, 6, l))
        }
        if (d.m_pm_password) {
            l = a.base64_encode(d.m_pm_password);
            i.push(a.smf.Codec.ParamParse.encSmfParam(0, 7, l))
        }
        if (d.m_pm_respcode) {
            l = a.Convert.int32ToStr(d.m_pm_respcode);
            l += d.m_pm_respstr;
            i.push(a.smf.Codec.ParamParse.encSmfParam(0, 8, l))
        }
        d.m_pm_deliverymode !== null && i.push(a.smf.Codec.ParamParse.encSmfParam(0, 16, a.smf.Codec.ParamParse.encDeliveryMode(d.m_pm_deliverymode)));
        d.m_pm_content_summary && i.push(a.smf.Codec.ParamParse.encSmfParam(2, 22, a.smf.Codec.ParamParse.encContentSummary(d.m_pm_content_summary)));
        i = i.join("");
        l = 12 + i.length;
        var c = l + d.m_payloadLength;
        h.push(a.Convert.int32ToStr(e));
        h.push(a.Convert.int32ToStr(l));
        h.push(a.Convert.int32ToStr(c));
        h.push(i);
        d.setMessageSizes(l,
            d.m_payloadLength);
        return h.join("")
    };
    a.smf.Codec.Smp = {
        parseSmpAt: function(d, h) {
            if (h + 6 > d.length) return false;
            var e = h,
                i = a.Convert.strToInt8(d.substr(e, 1));
            e++;
            j(i, 7, 1);
            i = j(i, 0, 7);
            var l = new a.smf.SMPMessage;
            if (i === 0 || i === 1) {
                var c = a.Convert.strToUInt32(d.substr(e, 4));
                e += 4;
                if (h + c > d.length) return false;
                var f = a.Convert.strToInt8(d.substr(e, 1));
                e++;
                l.MsgType = i;
                l.SmpFlags = f;
                l.EncodedUtf8Subscription = d.substr(e, c - 6);
                return l
            } else return false
        },
        encSmp: function(d) {
            if (!(d.MsgType === 0 || d.MsgType === 1)) return false;
            var h = [],
                e = 0;
            e = n(e, 1, 7, 1);
            e = n(e, d.MsgType, 0, 7);
            h.push(a.Convert.int8ToStr(e));
            h.push(a.Convert.int32ToStr(6 + d.EncodedUtf8Subscription.length));
            h.push(a.Convert.int8ToStr(d.SmpFlags));
            h.push(d.EncodedUtf8Subscription);
            return h.join("")
        }
    };
    a.smf.Codec.ClientCtrl = {
        parseCCAt: function(d, h, e) {
            var i = new a.smf.ClientCtrlMessage;
            if (e < 6 || h + 6 > d.length) return i;
            e = h;
            var l = a.Convert.strToInt16(d.substr(e, 2));
            e += 2;
            j(l, 15, 1);
            var c = j(l, 8, 3),
                f = j(l, 0, 8);
            l = a.Convert.strToUInt32(d.substr(e, 4));
            e += 4;
            if (c !== 1) return false;
            if (l <= 0 || h + l > d.length) return false;
            i.MsgType = f;
            for (i.Version = c; e < h + l;) {
                f = a.Convert.strToInt8(d.substr(e, 1));
                e++;
                c = j(f, 7, 1);
                f = j(f, 0, 7);
                var o = a.Convert.strToUInt32(d.substr(e, 4));
                if (o <= 0) return false;
                e += 4;
                o = o - 5;
                var m = d.substr(e, o);
                i.addParameter(new a.smf.SMFParameter(c, f, m));
                e += o
            }
            return i
        },
        encCC: function(d) {
            for (var h = [], e = d.getParameterArray(), i = 0; i < e.length; i++) {
                var l = e[i];
                if (typeof l !== "undefined") {
                    var c = 0;
                    c = n(c, l.getUh(), 7, 1);
                    c = n(c, l.getType(), 0, 7);
                    h.push(a.Convert.int8ToStr(c));
                    h.push(a.Convert.int32ToStr(l.getValue().length +
                        5));
                    h.push(l.getValue())
                }
            }
            h = h.join("");
            e = 0;
            e = n(e, 0, 15, 1);
            e = n(e, 0, 11, 4);
            e = n(e, 1, 8, 3);
            e = n(e, d.MsgType, 0, 8);
            d = [];
            d.push(a.Convert.int16ToStr(e));
            d.push(a.Convert.int32ToStr(6 + h.length));
            d.push(h);
            return d.join("")
        }
    };
    a.smf.Codec.TsSmf = {
        parseTsSmfMsgAt: function(d, h, e) {
            e = g(d, h, e);
            if (!e) return false;
            h = h;
            h += e.TsHeaderLength;
            if (d.length - h < e.PayloadLength) return false;
            e.Payload = d.substr(h, e.PayloadLength);
            return e
        },
        parseTsSmfHdrAt: g
    };
    var p = function() {
            var d = [];
            d[0] = a.MessageUserCosType.COS1;
            d[1] = a.MessageUserCosType.COS2;
            d[2] = a.MessageUserCosType.COS3;
            return d
        }(),
        r = function() {
            var d = [];
            d[a.MessageUserCosType.COS1] = 0;
            d[a.MessageUserCosType.COS2] = 1;
            d[a.MessageUserCosType.COS3] = 2;
            return d
        }();
    a.smf.Codec.decodeCompoundMessage = function(d, h) {
        var e = a.smf.Codec.parseSmfAt(d, h);
        if (!e) return null;
        var i = h + e.m_headerLength,
            l = e.m_payloadLength;
        switch (e.m_smf_protocol) {
            case 20:
                if (i = a.smf.Codec.TsSmf.parseTsSmfMsgAt(d, i, e)) {
                    i.setSmfHeader(e);
                    return i
                }
                break;
            case 13:
                i = new a.Message;
                i.m_smfHeader = e;
                i.setDeliverToOne(e.m_smf_dto ? true :
                    false);
                i.setDeliveryMode(e.m_pm_deliverymode || a.MessageDeliveryModeType.DIRECT);
                i.setDestination(new a.Topic(e.m_pm_tr_topicname_bytes));
                i.setDiscardIndication(e.m_smf_di ? true : false);
                i.setElidingEligible(e.m_smf_elidingeligible ? true : false);
                i.setUserCos(p[e.m_smf_priority] || a.MessageUserCosType.COS1);
                i.setUserData(e.m_pm_userdata ? e.m_pm_userdata : null);
                i.m_redelivered = e.m_pm_ad_redelflag ? true : false;
                l = h + e.m_headerLength;
                var c = e.m_pm_content_summary,
                    f = a.smf.Codec.ParamParse.ContentSummaryType;
                if (c && c.length >
                    0)
                    for (e = 0; e < c.length; e++) {
                        var o = c[e],
                            m = d.substr(l + o.Position, o.Length);
                        if (o.Type === f.BINARY_ATTACHMENT) i.setBinaryAttachment(m);
                        else if (o.Type === f.BINARY_METADATA) {
                            m = a.smf.BinaryMetaBlock.fromEncodedSmf(m, 0);
                            i.setBinaryMetadataChunk(m);
                            if (m.Type === 0) {
                                o = i;
                                if ((m = a.sdt.Codec.parseSdt(m.Payload, 0)) && m.getType() === a.SDTFieldType.STREAM) {
                                    m = m.getValue();
                                    var s = m.getNext();
                                    if (s && s.getType() === a.SDTFieldType.BYTEARRAY) {
                                        var t = s.getValue().charCodeAt(0) & 255;
                                        if ((t & 128) === 0) o.m_messageType = {
                                            10: a.MessageType.MAP,
                                            11: a.MessageType.STREAM,
                                            7: a.MessageType.TEXT
                                        } [t & 15] || a.MessageType.BINARY;
                                        if (s.getValue().length >= 1) {
                                            s = s.getValue().charCodeAt(1) & 255;
                                            o.setAsReplyMessage((s & 128) !== 0)
                                        }
                                    }
                                    if ((s = m.getNext()) && s.getType() === a.SDTFieldType.MAP) {
                                        m = s.getValue();
                                        if (m.getField("p")) {
                                            s = m.getField("p").getValue();
                                            o.setUserPropertyMap(s)
                                        }
                                        if (m.getField("h")) {
                                            m = m.getField("h").getValue();
                                            m.getField("ci") && o.setCorrelationId(m.getField("ci").getValue());
                                            m.getField("mi") && o.setApplicationMessageId(m.getField("mi").getValue());
                                            m.getField("mt") &&
                                                o.setApplicationMessageType(m.getField("mt").getValue());
                                            m.getField("rt") && o.setReplyTo(m.getField("rt").getValue());
                                            m.getField("si") && o.setSenderId(m.getField("si").getValue());
                                            m.getField("sn") && o.setSequenceNumber(m.getField("sn").getValue());
                                            m.getField("ts") && o.setSenderTimestamp(m.getField("ts").getValue())
                                        }
                                    }
                                }
                            }
                        } else if (o.Type !== f.CID_LIST)
                            if (o.Type === f.XML_META) i.setXmlMetadata(m);
                            else o.Type === f.XML_PAYLOAD && i.setXmlContent(m)
                    } else i.setBinaryAttachment(e.m_payloadLength > 0 ? d.substr(l, e.m_payloadLength) :
                        null);
                return i;
            case 12:
                if (i = a.smf.Codec.ClientCtrl.parseCCAt(d, i, l)) {
                    i.setSmfHeader(e);
                    return i
                }
                break;
            case 15:
                if (i = a.smf.Codec.Smp.parseSmpAt(d, i)) {
                    i.setSmfHeader(e);
                    return i
                }
                break;
            case 10:
            case 11:
                i = new a.smf.KeepAliveMessage;
                i.setSmfHeader(e);
                return i
        }
        return null
    };
    a.smf.Codec.encodeCompoundMessage = function(d) {
        var h = [],
            e = [];
        if (d instanceof a.smf.ClientCtrlMessage) {
            h = a.smf.Codec.ClientCtrl.encCC(d);
            d.getSmfHeader().setPayloadSize(h.length);
            e = a.smf.Codec.encSmf(d.getSmfHeader())
        } else if (d instanceof a.smf.SMPMessage) {
            h = a.smf.Codec.Smp.encSmp(d);
            d.getSmfHeader().setPayloadSize(h.length);
            e = a.smf.Codec.encSmf(d.getSmfHeader())
        } else if (d instanceof a.smf.KeepAliveMessage) {
            d.getSmfHeader().setPayloadSize(0);
            e = a.smf.Codec.encSmf(d.getSmfHeader())
        } else if (d instanceof a.Message) {
            if (d.m_smfHeader === null) {
                h = new a.smf.SMFHeader;
                h.m_smf_protocol = 13;
                h.m_smf_ttl = 255;
                d.m_smfHeader = h
            }
            h = d.m_smfHeader;
            h.m_smf_dto = d.isDeliverToOne() ? true : false;
            h.m_pm_deliverymode = d.getDeliveryMode();
            h.m_smf_di = d.isDiscardIndication() ?
                true : false;
            h.m_smf_elidingeligible = d.isElidingEligible() ? true : false;
            e = d.getDestination();
            if (e !== null && e instanceof a.Topic) h.m_pm_tr_topicname_bytes = e.getName();
            if (d.getCorrelationId() || d.getApplicationMessageId() || d.getApplicationMessageType() || d.getReplyTo() || d.getSenderId() || d.getSequenceNumber() || d.getSenderTimestamp() || d.getUserPropertyMap() || d.isReplyMessage() || d.getType() !== a.MessageType.BINARY) b(d);
            e = d.getUserCos();
            h.m_smf_priority = r[e] || 0;
            h.m_pm_userdata = d.getUserData() === null ? null : d.getUserData();
            e = a.smf.Codec.ParamParse.ContentSummaryType;
            var i = [],
                l = [];
            k(i, l, d.getXmlMetadata(), e.XML_META);
            k(i, l, d.getXmlContent(), e.XML_PAYLOAD);
            k(i, l, d.getBinaryAttachment(), e.BINARY_ATTACHMENT);
            var c = null;
            if ((c = d.getBinaryMetadataChunk()) !== null) {
                c = c.asEncodedSmf();
                k(i, l, c, e.BINARY_METADATA)
            }
            if (!(i.length === 0 || i.length === 1 && i[0].Type === e.BINARY_ATTACHMENT)) h.m_pm_content_summary = i;
            e = l.join("");
            h.m_payload = e;
            h.setPayloadSize(e.length);
            h = d.m_smfHeader.m_payload;
            e = a.smf.Codec.encSmf(d.m_smfHeader)
        }
        return e + h
    }
})(solace);
(function(a) {
    function g() {
        this.m_parameters = [];
        this.m_smfHeader = null
    }

    function b() {
        this.m_parameters = [];
        this.m_smf_version = 3;
        this.m_smf_adf = this.m_smf_dto = this.m_smf_elidingeligible = this.m_smf_tqd = this.m_smf_di = this.m_smf_msgLen = this.m_smf_ttl = this.m_smf_priority = this.m_smf_protocol = this.m_smf_uh = 0;
        this.m_pm_userdata = null;
        this.m_pm_respcode = 0;
        this.m_pm_deliverymode = this.m_pm_tr_topicname_bytes = this.m_pm_password = this.m_pm_username = this.m_pm_respstr = null;
        this.m_pm_ad_ttl = this.m_pm_ad_flowredelflag =
            this.m_pm_ad_redelflag = this.m_pm_ad_msgid = 0;
        this.m_pm_corrtag = this.m_pm_content_summary = null;
        this.m_pm_ad_prevmsgid = this.m_pm_queue_len = this.m_pm_queue_offset = this.m_pm_topic_len = this.m_pm_topic_offset = 0;
        this.m_pm_msg_priority = null;
        this.m_pm_ad_flowid = 0;
        this.m_unknownProtoFlag = false;
        this.m_headerLength = this.m_payloadLength = this.m_messageLength = 0;
        this.m_payload = null
    }

    function k(i, l, c) {
        this.m_type = l;
        this.m_value = c;
        this.m_uh = i
    }

    function j() {
        this.Type = 0;
        this.Payload = ""
    }

    function n() {
        this.m_smfHeader = new a.smf.SMFHeader;
        this.m_smfHeader.m_smf_protocol = 15;
        this.m_smfHeader.m_smf_ttl = 1;
        this.MsgType = 0;
        this.EncodedUtf8Subscription = null;
        this.SmpFlags = 4;
        this.m_encodedClientName = this.m_encodedQueueName = null
    }

    function p() {
        this.m_smfHeader = new a.smf.SMFHeader;
        this.m_smfHeader.m_smf_protocol = 12;
        this.m_smfHeader.m_smf_ttl = 1;
        this.m_parameters = [];
        this.MsgType = 0;
        this.Version = 1
    }

    function r() {
        var i = new a.smf.SMFHeader;
        i.m_smf_protocol = 11;
        i.m_smf_uh = 2;
        i.m_smf_ttl = 1;
        this.m_smfHeader = i
    }

    function d() {
        this.UH = 0;
        this.Payload = this.RouterTag =
            this.SessionId = this.MessageType = null;
        this.TsHeaderLength = this.PayloadLength = 0;
        this.m_parameters = this.m_smfHeader = null
    }
    a.smf = a.smf || {};
    var h = a.smf.Codec.bits;
    g.prototype.addParameter = function(i) {
        this.m_parameters[i.getType()] = i
    };
    g.prototype.getParameter = function(i) {
        return this.m_parameters[i]
    };
    g.prototype.getParameterArray = function() {
        if (typeof this.m_parameters === "undefined") return false;
        return this.m_parameters
    };
    g.prototype.getSmfHeader = function() {
        return this.m_smfHeader
    };
    g.prototype.setSmfHeader =
        function(i) {
            this.m_smfHeader = i
        };
    g.prototype.getResponse = function() {
        var i = this.getSmfHeader();
        return i && i.m_pm_respcode && i.m_pm_respstr ? {
            ResponseCode: i.m_pm_respcode,
            ResponseString: i.m_pm_respstr
        } : null
    };
    b.prototype.setMessageSizes = function(i, l) {
        this.m_headerLength = i;
        this.m_payloadLength = l;
        this.m_messageLength = i + l
    };
    b.prototype.setPayloadSize = function(i) {
        this.m_payloadLength = i
    };
    a.smf.SMFHeader = b;
    k.prototype.getType = function() {
        return this.m_type
    };
    k.prototype.getValue = function() {
        return this.m_value
    };
    k.prototype.getUh =
        function() {
            return this.m_uh
        };
    a.smf.SMFParameter = k;
    j.prototype.asEncodedSmf = function() {
        var i = [];
        i.push(a.Convert.int8ToStr(1));
        i.push(a.Convert.int8ToStr(this.Type));
        i.push(a.Convert.int24ToStr(this.Payload.length));
        i.push(this.Payload);
        return i.join("")
    };
    j.fromEncodedSmf = function(i, l) {
        if (typeof l === "undefined") l = 0;
        if (i.length - l < 6) return null;
        var c = a.Convert.strToInt8(i.substr(l, 1)),
            f = a.Convert.strToInt32(i.substr(l + 1, 4)),
            o = new j;
        o.Type = h(f, 24, 8);
        f = h(f, 0, 24);
        o.Payload = i.substr(l + (c * 4 + 1), f);
        return o
    };
    a.smf.BinaryMetaBlock = j;
    n.prototype = new g;
    n.prototype.isFlag = function(i) {
        return this.SmpFlags & i
    };
    n.prototype.setFlag = function(i, l) {
        if (l) this.SmpFlags |= i;
        else this.SmpFlags &= ~i
    };
    n.prototype.encodeTopic = function(i) {
        this.EncodedUtf8Subscription = a.Util.nullTerminate(i)
    };
    n.getSubscriptionMessage = function(i, l, c, f) {
        var o = "";
        if (typeof l === "string") o = l;
        else if (l instanceof a.Destination) o = l.getName();
        l = new n;
        l.MsgType = c ? 0 : 1;
        l.encodeTopic(o);
        l.setFlag(4, true);
        f && l.setFlag(8, true);
        l.m_smfHeader.m_pm_corrtag =
            i;
        return l
    };
    a.smf.SMPMessage = n;
    a.Convert.int8ToStr(0);
    var e = new g;
    p.prototype = e;
    e.getP2PTopicValue = function() {
        var i = null;
        return (i = this.getParameter(8)) ? a.Util.stripNullTerminate(i.getValue()) : null
    };
    e.getVpnNameInUseValue = function() {
        var i = null;
        return (i = this.getParameter(6)) ? a.Util.stripNullTerminate(i.getValue()) : null
    };
    e.getVridInUseValue = function() {
        var i = null;
        return (i = this.getParameter(10)) ? a.Util.stripNullTerminate(i.getValue()) : null
    };
    e.getUserIdValue = function() {
        var i = null;
        return (i = this.getParameter(3)) ?
            a.Util.stripNullTerminate(i.getValue()) : null
    };
    e.prmGetDtoPriorityValue = function(i) {
        if (typeof i.local === "undefined" || typeof i.network === "undefined") return false;
        var l = 0;
        l = a.smf.Codec.setBits(l, i.local, 8, 8);
        l = a.smf.Codec.setBits(l, i.network, 0, 8);
        return a.Convert.int16ToStr(l)
    };
    e.prmParseDtoPriorityValue = function(i) {
        var l = {};
        i = a.Convert.strToInt16(i.substr(0, 2));
        l.local = a.smf.Codec.bits(i, 8, 8);
        l.network = a.smf.Codec.bits(i, 0, 8);
        return l
    };
    e.prmParseCapabilitiesValue = function(i, l) {
        if (!(i && l)) return false;
        var c = a.CapabilityType,
            f = 0,
            o = a.Convert.strToInt8(i.substr(f, 1));
        f++;
        var m = 0;
        if (o >= 1) {
            a.Convert.strToInt8(i.substr(f, 1));
            f++
        }
        if (o >= 9) {
            m = a.Convert.strToInt8(i.substr(f, 1));
            f++;
            l[c.MESSAGE_ELIDING] = h(m, 3, 1) ? true : false;
            l[c.NO_LOCAL] = h(m, 1, 1) ? true : false
        }
        if (o > 16) f += Math.ceil((o - 16) / 8);
        for (o = 500; f < i.length && o-- > 0;) {
            m = a.Convert.strToInt8(i.substr(f, 1));
            f++;
            var s = a.Convert.strToInt32(i.substr(f, 4));
            f += 4;
            s -= 5;
            var t = i.substr(f, s);
            f += s;
            switch (m) {
                case 0:
                    l[c.PEER_PORT_SPEED] = t.length === 4 ? a.Convert.strToInt32(t) :
                        0;
                    break;
                case 1:
                    l[c.PEER_PORT_TYPE] = t.length === 1 ? a.Convert.strToInt8(t) : 0;
                    break;
                case 3:
                    l[c.MAX_DIRECT_MSG_SIZE] = t.length === 4 ? a.Convert.strToInt32(t) : 0
            }
        }
        return l
    };
    e.getRouterCapabilities = function() {
        var i = [],
            l = null;
        if (l = this.getParameter(9)) i = this.prmParseCapabilitiesValue(l.getValue(), i);
        if (l = this.getParameter(0)) i[a.CapabilityType.PEER_SOFTWARE_VERSION] = a.Util.stripNullTerminate(l.getValue());
        if (l = this.getParameter(1)) i[a.CapabilityType.PEER_SOFTWARE_DATE] = a.Util.stripNullTerminate(l.getValue());
        if (l =
            this.getParameter(2)) i[a.CapabilityType.PEER_PLATFORM] = a.Util.stripNullTerminate(l.getValue());
        if (l = this.getParameter(12)) i[a.CapabilityType.PEER_ROUTER_NAME] = a.Util.stripNullTerminate(l.getValue());
        return i
    };
    p.getLogin = function(i, l) {
        var c = new a.smf.ClientCtrlMessage;
        if (!(i instanceof a.SessionProperties)) return false;
        c.MsgType = 0;
        var f = c.m_smfHeader;
        f.m_pm_corrtag = l;
        if (i.password) f.m_pm_password = i.password;
        if (i.userName) f.m_pm_username = i.userName;
        i.subscriberLocalPriority && i.subscriberNetworkPriority &&
            c.addParameter(new k(0, 7, this.prototype.prmGetDtoPriorityValue({
                local: i.subscriberLocalPriority,
                network: i.subscriberNetworkPriority
            })));
        i.vpnName && i.vpnName.length > 0 && c.addParameter(new k(1, 6, a.Util.nullTerminate(i.vpnName)));
        i.applicationDescription && i.applicationDescription.length > 0 && c.addParameter(new k(0, 4, a.Util.nullTerminate(i.applicationDescription)));
        i.userIdentification && i.userIdentification.length > 0 && c.addParameter(new k(0, 3, a.Util.nullTerminate(i.userIdentification)));
        c.addParameter(new k(0,
            5, a.Util.nullTerminate(i.clientName)));
        c.addParameter(new k(0, 2, a.Util.nullTerminate(navigator.platform + " - JS API (Release)")));
        i.noLocal && c.addParameter(new k(0, 15, a.Convert.int8ToStr(1)));
        var o = "20131031-1626";
        f = "20131031-1626".substring(0, 8);
        var m = "20131031-1626".substring(9);
        if (f.length === 8 && m.length === 4) {
            o = new a.StringBuffer;
            o.append(f.charAt(0)).append(f.charAt(1));
            o.append(f.charAt(2)).append(f.charAt(3));
            o.append("/");
            o.append(f.charAt(4)).append(f.charAt(5));
            o.append("/");
            o.append(f.charAt(6)).append(f.charAt(7));
            o.append(" ");
            o.append(m.charAt(0)).append(m.charAt(1));
            o.append(":");
            o.append(m.charAt(2)).append(m.charAt(3));
            o = o.toString()
        }
        c.addParameter(new k(0, 1, a.Util.nullTerminate(o)));
        c.addParameter(new k(0, 0, a.Util.nullTerminate("6.2.0.5")));
        return c
    };
    p.getUpdate = function(i, l, c) {
        var f = new p;
        f.MsgType = 1;
        f.m_smfHeader.m_pm_corrtag = c;
        if (i === a.MutableSessionProperty.CLIENT_DESCRIPTION) {
            l = (l + "").substr(0, 250);
            f.addParameter(new k(0, 4, a.Util.nullTerminate(l)))
        } else if (i === a.MutableSessionProperty.CLIENT_NAME) {
            if (i =
                p.validateClientName(l)) throw new a.OperationError(i, a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
            f.addParameter(new k(0, 5, a.Util.nullTerminate(l)))
        }
        return f
    };
    p.validateClientName = function(i) {
        var l = a.TopicUtil.validateTopic(i);
        if (l) return l;
        if (l = i.length <= 160 ? null : "Client Name too long (max length: 160).") return l;
        return null
    };
    a.smf.ClientCtrlMessage = p;
    r.prototype = new g;
    a.smf.KeepAliveMessage = r;
    d.prototype = new g;
    a.TransportSmfMessage = d
})(solace);
(function(a) {
    a.CacheCBInfo = function(g, b) {
        this.cacheCBFunction = g;
        this.userObject = b
    };
    a.CacheCBInfo.prototype.getCallback = function() {
        return this.cacheCBFunction
    };
    a.CacheCBInfo.prototype.getUserObject = function() {
        return this.userObject
    };
    a.CacheLiveDataAction = {
        FULFILL: 1,
        QUEUE: 2,
        FLOW_THRU: 3
    };
    a.CacheGetResult = function() {
        this.messageID = null;
        this.version = 0;
        this.responseCode = a.CacheGetResultCode.INVALID;
        this.matchTopic = this.responseString = "";
        this.clusterNameStream = this.messageStream = this.replyTo = this.hasTimestamps =
            this.hasMore = this.isSuspect = this.sessionID = null
    };
    a.CacheGetResult.prototype.readFromStream = function(g) {
        this.messageID = g.getNext().getValue();
        this.version = g.getNext().getValue();
        this.responseCode = g.getNext().getValue();
        this.responseString = g.getNext().getValue();
        this.matchTopic = g.getNext().getValue();
        this.sessionID = g.getNext().getValue();
        this.isSuspect = g.getNext().getValue();
        this.hasMore = g.getNext().getValue();
        this.hasTimestamps = g.getNext().getValue();
        if (g.hasNext()) this.messageStream = g.getNext().getValue();
        if (g.hasNext()) {
            this.clusterNameStream = this.messageStream;
            this.messageStream = g.getNext().getValue()
        }
    };
    a.CacheGetResultCode = {
        INVALID: 0,
        OK: 1
    };
    a.CacheRequestCorrelationID = 0;
    a.CacheRequest = function(g, b, k, j, n, p, r) {
        this.cacheSession = g;
        this.cacheMessageType = b;
        this.requestID = k;
        this.cbInfo = j;
        this.liveDataAction = n;
        this.topic = p;
        this.cacheName = r;
        this.subscriptionWaiting = null;
        this.isSuspect = this.dataReceived = this.replyReceived = false;
        this.correlationID = a.CacheRequestPrefix + a.CacheRequestCorrelationID++;
        this.childRequests = [];
        this.parentRequest = null;
        this.queuedLiveData = [];
        this.liveDataFulfilled = false;
        this.timeoutHandle = null
    };
    a.CacheRequest.VERSION = 1;
    a.CacheRequest.DEFAULT_REPLY_SIZE_LIMIT = 1E6;
    a.CacheRequest.REPLY_SIZE_LIMIT = a.CacheRequest.DEFAULT_REPLY_SIZE_LIMIT;
    a.CacheRequest.prototype.getRootRequest = function() {
        if (!this.parentRequest) return this;
        return this.parentRequest.getRootRequest()
    };
    a.CacheRequest.prototype.addChild = function(g) {
        if (g === this) throw Error("Constructing circular child reference");
        g.parentRequest =
            this;
        this.childRequests.push(g)
    };
    a.CacheRequest.prototype.removeChild = function(g) {
        if (g === this) throw Error("Attempting to deconstruct invalid circular child reference");
        this.childRequests.splice(this.childRequests.indexOf(g), 1);
        g.parentRequest = null
    };
    a.CacheRequest.prototype.collapse = function() {
        var g = this.parentRequest;
        g.isSuspect = g.isSuspect || this.isSuspect;
        g.dataReceived = g.dataReceived || this.dataReceived;
        g.removeChild(this)
    };
    a.CacheRequest.prototype.cancel = function() {
        this.parentRequest && this.collapse();
        for (var g, b = 0; b < this.childRequests.length; b++) {
            g = this.childRequests[b];
            g.childRequests && g.cancel();
            this.removeChild(g)
        }
        this.clearRequestTimeout()
    };
    a.CacheRequest.prototype.getRequestID = function() {
        return this.requestID
    };
    a.CacheRequest.prototype.getCBInfo = function() {
        return this.cbInfo
    };
    a.CacheRequest.prototype.getTopic = function() {
        return this.topic
    };
    a.CacheRequest.prototype.getLiveDataAction = function() {
        return this.liveDataAction
    };
    a.CacheRequest.prototype.startRequestTimeout = function(g, b) {
        var k = this;
        this.timeoutHandle = setTimeout(function() {
            g(k)
        }, b)
    };
    a.CacheRequest.prototype.clearRequestTimeout = function() {
        if (this.timeoutHandle !== null) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null
        }
    };
    a.CacheRequest.prototype.toString = function() {
        return "CacheRequest[correlationID=" + this.correlationID + ",requestID=" + this.requestID + ",cacheName=" + this.cacheName + ",topic=" + this.topic.getName() + "]"
    };
    a.CacheRequestType = {
        INVALID: 0,
        BULK_MSG: 1,
        REGISTER_REQUEST: 2,
        REGISTER_RESPONSE: 3,
        HEARTBEAT_REQUEST: 4,
        HEARTBEAT_RESPONSE: 5,
        EVENT_NOTIFY: 6,
        EVENT_ACK: 7,
        ACTION_REQUEST: 8,
        ACTION_RESPONSE: 9,
        GET_REQUEST: 10,
        GET_RESPONSE: 11,
        GET_NEXT_REQUEST: 12,
        GET_NEXT_RESPONSE: 13,
        SET_REQUEST: 14,
        SET_RESPONSE: 15,
        GET_MSG_REQUEST: 16,
        GET_MSG_RESPONSE: 17,
        GET_NEXT_MSG_REQUEST: 18,
        GET_NEXT_MSG_RESPONSE: 19,
        UNREGISTER_IND: 20,
        BULK_SET_REQUEST: 21,
        BULK_SET_RESPONSE: 22,
        PURGE_MSG_SEQUENCE_REQUEST: 23,
        PURGE_MSG_SEQUENCE_RESPONSE: 24,
        GET_MSG_SEQUENCE_REQUEST: 25,
        GET_NEXT_MSG_SEQUENCE_REQUEST: 26,
        GET_TOPIC_INFO_REQUEST: 27,
        GET_TOPIC_INFO_RESPONSE: 28,
        READY_MARKER: 29,
        GET_TOPIC_INFO_REQUEST_RANGE: 30,
        SYNC_READY_MARKER: 31,
        VACUUM_REQUEST: 32,
        VACUUM_RESPONSE: 33
    };
    a.CacheRequestResult = function(g, b, k, j) {
        this.returnCode = g;
        this.subcode = b;
        this.topic = k;
        this.error = j
    };
    a.CacheRequestResult.prototype.getReturnCode = function() {
        return this.returnCode
    };
    a.CacheRequestResult.prototype.getReturnSubcode = function() {
        return this.subcode
    };
    a.CacheRequestResult.prototype.getTopic = function() {
        return this.topic
    };
    a.CacheRequestResult.prototype.getError = function() {
        return this.error
    };
    a.CacheReturnCode = {
        OK: 1,
        FAIL: 2,
        INCOMPLETE: 3
    };
    a.CacheReturnSubcode = {
        REQUEST_COMPLETE: 0,
        LIVE_DATA_FULFILL: 1,
        ERROR_RESPONSE: 2,
        INVALID_SESSION: 3,
        REQUEST_TIMEOUT: 4,
        REQUEST_ALREADY_IN_PROGRESS: 5,
        NO_DATA: 6,
        SUSPECT_DATA: 7,
        CACHE_SESSION_DISPOSED: 8,
        SUBSCRIPTION_ERROR: 9
    };
    a.CacheSession = function(g, b) {
        this.validateProps(g);
        this.properties = new a.CacheSessionProperties(g.cacheName, g.maxAgeSec, g.maxMessages, g.timeoutMsec);
        this.outstandingRequests = {};
        this.outstandingIDs = {};
        this.session = b;
        this.disposed = false;
        this.nextSessionEventCallbackInfo =
            this.nextMessageCallbackInfo = null;
        this.connectToSession(b)
    };
    a.CacheSession.prototype.validateProps = function(g) {
        if (typeof g.cacheName !== "string") throw new a.OperationError("Invalid parameter type for cacheName", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        var b = a.TopicUtil.validateTopic(g.cacheName);
        if (b) throw new a.OperationError(b, a.ErrorSubcode.INVALID_TOPIC_SYNTAX, null);
        if (typeof g.maxAgeSec !== "number") throw new a.OperationError("Invalid parameter type for maxAgeSec", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        if (g.maxAgeSec < 0) throw new a.OperationError("Invalid value for maxAgeSec; must be >= 0", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        if (typeof g.maxMessages !== "number") throw new a.OperationError("Invalid parameter type for maxMessages", a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        if (g.maxMessages < 0) throw new a.OperationError("Invalid value for maxMessages; must be >= 0", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        if (typeof g.timeoutMsec !== "number") throw new a.OperationError("Invalid parameter type for timeoutMsec",
            a.ErrorSubcode.PARAMETER_INVALID_TYPE);
        if (g.timeoutMsec < 3E3) throw new a.OperationError("Invalid value for timeoutMsec; must be >= 3000", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
    };
    a.CacheSession.prototype.connectToSession = function(g) {
        this.nextSessionEventCallbackInfo = g.getEventCBInfo();
        this.nextMessageCallbackInfo = g.getMessageCBInfo();
        var b = this;
        g.setMessageCBInfo(new a.CacheMessageRxCBInfo(function(k, j) {
            b.handleMessage(j)
        }, null));
        g.setEventCBInfo(this.createCompoundEventCB(this.nextSessionEventCallbackInfo))
    };
    a.CacheSession.prototype.createCompoundEventCB = function(g) {
        var b = this;
        return new a.SessionEventCBInfo(function(k, j, n, p) {
            b.handleSessionEvent(g, k, j, n, p)
        }, null)
    };
    a.CacheSession.prototype.handleSessionEvent = function(g, b, k) {
        if (this.processSessionEvent(b, k)) {
            var j = g.userObject;
            j === null ? g.sessionEventCBFunction(b, k) : g.sessionEventCBFunction(b, k, j)
        }
    };
    a.CacheSession.prototype.sendToNextDelegate = function(g) {
        var b = this.nextMessageCallbackInfo.userObject;
        b === null ? this.nextMessageCallbackInfo.messageRxCBFunction(this.session,
            g) : this.nextMessageCallbackInfo.messageRxCBFunction(this.session, g, b)
    };
    a.CacheSession.prototype.processSessionEvent = function(g, b) {
        switch (b.sessionEventCode) {
            case a.SessionEventCode.SUBSCRIPTION_ERROR:
            case a.SessionEventCode.SUBSCRIPTION_OK:
                return this.checkSubscriptionStatus(b);
            case a.SessionEventCode.DOWN_ERROR:
                this.dispose();
                return true;
            default:
                return true
        }
    };
    a.CacheSession.prototype.checkSubscriptionStatus = function(g) {
        if (g.correlationKey === null || !(g.correlationKey instanceof a.CacheSessionSubscribeInfo) ||
            g.correlationKey.cacheSession !== this) return true;
        var b = this.getOutstandingRequest(g.correlationKey.correlationID);
        if (!b) return true;
        g.sessionEventCode === a.SessionEventCode.SUBSCRIPTION_OK ? this.handleSubscriptionSuccess(b, g.correlationKey.topic) : this.handleSubscriptionError(b, g);
        return false
    };
    a.CacheSession.prototype.handleSubscriptionSuccess = function(g) {
        g.subscriptionWaiting = null;
        this.startCacheRequest(g)
    };
    a.CacheSession.prototype.handleSubscriptionError = function(g) {
        this.terminateRequest(g, a.CacheReturnCode.FAIL,
            a.CacheReturnSubcode.SUBSCRIPTION_ERROR)
    };
    a.CacheSession.prototype.checkRequestCompletion = function(g) {
        if (!g.childRequests.length)
            if (!g.subscriptionWaiting)
                if (!(g.timeoutHandle !== null && !g.replyReceived))
                    if (g.parentRequest) {
                        var b = g.parentRequest;
                        g.cancel();
                        this.unregisterRequest(g);
                        this.checkRequestCompletion(b)
                    } else {
                        var k;
                        if (g.isSuspect) {
                            b = a.CacheReturnCode.INCOMPLETE;
                            k = a.CacheReturnSubcode.SUSPECT_DATA
                        } else if (g.dataReceived) {
                            b = a.CacheReturnCode.OK;
                            k = g.liveDataFulfilled ? a.CacheReturnSubcode.LIVE_DATA_FULFILL :
                                a.CacheReturnSubcode.REQUEST_COMPLETE
                        } else if (g.replyReceived) {
                            b = a.CacheReturnCode.INCOMPLETE;
                            k = a.CacheReturnSubcode.NO_DATA
                        } else throw Error("Sanity: should never happen");
                        this.terminateRequest(g, b, k)
                    }
    };
    a.CacheSession.prototype.sendSeeOther = function(g, b) {
        var k = b.clusterNameStream.getNext().getValue();
        g.getRootRequest();
        k = new a.CacheRequest(this, a.CacheRequestType.GET_MSG_REQUEST, g.requestID, new a.CacheCBInfo(this.swallowChildReply, null), g.liveDataAction, g.topic, k);
        g.addChild(k);
        this.registerRequest(k);
        k.startRequestTimeout(this.handleCacheRequestTimeout, this.properties.timeoutMsec);
        this.startCacheRequest(k, null, null, true)
    };
    a.CacheSession.prototype.sendGetNext = function(g, b) {
        var k = new a.CacheRequest(this, a.CacheRequestType.GET_NEXT_MSG_REQUEST, g.requestID, new a.CacheCBInfo(this.swallowChildReply, null), g.liveDataAction, g.topic, g.cacheName);
        g.addChild(k);
        this.registerRequest(k);
        k.startRequestTimeout(this.handleCacheRequestTimeout, this.properties.timeoutMsec);
        this.startCacheRequest(k, b.sessionID, b.replyTo)
    };
    a.CacheSession.prototype.decodeMessageStream = function(g, b) {
        if (!b.messageStream) return [];
        for (var k, j = []; b.messageStream.hasNext();) {
            g.dataReceived = true;
            k = b.messageStream.getNext().getValue();
            k = a.smf.Codec.decodeCompoundMessage(k, 0);
            k.setCacheStatus(b.isSuspect ? a.MessageCacheStatus.SUSPECT : a.MessageCacheStatus.CACHED);
            k.setCacheRequestID(g.requestID);
            j.push(k)
        }
        return j
    };
    a.CacheSession.prototype.handleMessage = function(g) {
        var b = g.getCorrelationId();
        if (b = b ? this.outstandingRequests[b] : null) {
            b.clearRequestTimeout();
            var k = g.getSdtContainer().getValue();
            k || this.terminateRequest(b, a.CacheReturnCode.FAIL, a.CacheReturnSubcode.ERROR_RESPONSE);
            this.incStat(a.StatType.RX_REPLY_MSG_RECVED);
            b.replyReceived = true;
            if (b.getRootRequest().liveDataFulfilled) {
                this.incStat(a.StatType.CACHE_REQUEST_FULFILL_DISCARD_RESPONSE);
                this.checkRequestCompletion(b)
            } else try {
                var j = new a.CacheGetResult;
                j.readFromStream(k);
                j.replyTo = g.getReplyTo();
                b.isSuspect = b.isSuspect || j.isSuspect;
                var n = this.decodeMessageStream(b, j);
                this.incStat(a.StatType.RX_CACHE_MSG,
                    n.length);
                j.hasMore && this.sendGetNext(b, j);
                if (j.clusterNameStream)
                    for (; j.clusterNameStream.hasNext();) this.sendSeeOther(b, j);
                if (n)
                    for (g = 0; g < n.length; g++) this.sendToNextDelegate(n[g]);
                this.checkRequestCompletion(b)
            } catch (p) {
                this.terminateRequest(b, a.CacheReturnCode.FAIL, a.CacheReturnSubcode.ERROR_RESPONSE)
            }
        } else this.relevantLiveData(g) && this.sendToNextDelegate(g)
    };
    a.CacheSession.prototype.relevantLiveData = function(g) {
        if (g.getCorrelationId() && g.getCorrelationId().indexOf(a.CacheRequestPrefix) === 0 &&
            !(this.nextMessageCallbackInfo instanceof a.CacheMessageRxCBInfo)) {
            this.incStat(a.StatType.RX_REPLY_MSG_DISCARD);
            return false
        }
        var b = true,
            k;
        for (k in this.outstandingRequests)
            if (typeof k === "string") {
                var j = this.outstandingRequests[k];
                if (j.topic.getName() === g.getDestination().getName()) b = b && this.performLiveDataAction(j, g)
            } return b
    };
    a.CacheSession.prototype.performLiveDataAction = function(g, b) {
        g.dataReceived = true;
        switch (g.liveDataAction) {
            case a.CacheLiveDataAction.QUEUE:
                g.queuedLiveData.push(b);
                return false;
            case a.CacheLiveDataAction.FULFILL:
                g.liveDataFulfilled || this.fulfillRequest(g);
                return true;
            default:
                return true
        }
    };
    a.CacheSession.prototype.fulfillRequest = function(g) {
        g.liveDataFulfilled = true;
        this.trackCompletionStats(a.CacheReturnCode.OK, a.CacheReturnSubcode.LIVE_DATA_FULFILL);
        var b = this;
        setTimeout(function() {
            b.notifyCallback(g, a.CacheReturnCode.OK, a.CacheReturnSubcode.LIVE_DATA_FULFILL, g.getTopic(), null)
        }, 0)
    };
    a.CacheSession.prototype.dispose = function() {
        var g = [],
            b;
        for (b in this.outstandingRequests) this.outstandingRequests[b] instanceof
        a.CacheRequest && g.push(this.outstandingRequests[b]);
        for (b = 0; b < g.length; b++) this.terminateRequest(g[b], a.CacheReturnCode.INCOMPLETE, a.CacheReturnSubcode.CACHE_SESSION_DISPOSED);
        this.outstandingRequests = [];
        this.session.setEventCBInfo(this.nextSessionEventCallbackInfo);
        this.session.setMessageCBInfo(this.nextMessageCallbackInfo);
        this.disposed = true
    };
    a.CacheSession.prototype.getProperties = function() {
        return this.properties
    };
    a.CacheSession.prototype.sendCacheRequest = function(g, b, k, j, n) {
        if (arguments.length !==
            5) throw new a.OperationError("sendCacheRequest() invoked with an illegal argument count of " + arguments.length);
        if (typeof k !== "boolean") throw new a.OperationError("Invalid subscribe flag argument, should be a boolean but was " + typeof k);
        if (typeof g !== "number") throw new a.OperationError("Invalid requestID", a.ErrorSubcode.PARAMETER_INVALID_TYPE, null);
        if (this.outstandingIDs[g]) throw new a.OperationError("Request already in progress with this requestID");
        if (!(b instanceof a.Topic)) throw new a.OperationError("Invalid topic",
            a.ErrorSubcode.PARAMETER_INVALID_TYPE, typeof b);
        var p = a.TopicUtil.validateTopic(b.getName());
        if (p) throw new a.OperationError(p, a.ErrorSubcode.INVALID_TOPIC_SYNTAX);
        if (!(j === a.CacheLiveDataAction.FLOW_THRU || j === a.CacheLiveDataAction.FULFILL || j === a.CacheLiveDataAction.QUEUE)) throw new a.OperationError("Invalid live data action", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        if (a.TopicUtil.isWildcarded(b.getName()) && j !== a.CacheLiveDataAction.FLOW_THRU) throw new a.OperationError("Wildcarded topic not supported for this live data action",
            a.ErrorSubcode.PARAMETER_CONFLICT);
        if (!(n instanceof a.CacheCBInfo)) throw new a.OperationError("Callback info was not an instance of solace.CacheCBInfo");
        if (this.disposed) n.cacheCBFunction(g, a.CacheReturnCode.FAIL, a.CacheReturnSubcode.CACHE_SESSION_DISPOSED);
        else {
            this.session.m_disposed && n.cacheCBFunction(g, a.CacheReturnCode.FAIL, a.CacheReturnSubcode.INVALID_SESSION);
            p = new a.CacheRequest(this, a.CacheRequestType.GET_MSG_REQUEST, g, n, j, b, this.properties.cacheName);
            for (var r in this.outstandingRequests)
                if (this.outstandingRequests[r].topic.getName() ===
                    b.getName())
                    if (!(j === this.outstandingRequests[r].liveDataAction && j === a.CacheLiveDataAction.FLOW_THRU)) {
                        this.registerRequest(p);
                        this.terminateRequest(p, a.CacheReturnCode.FAIL, a.CacheReturnSubcode.REQUEST_ALREADY_IN_PROGRESS);
                        return
                    } this.registerRequest(p);
            p.startRequestTimeout(this.handleCacheRequestTimeout, this.properties.timeoutMsec);
            if (k) {
                r = new a.CacheSessionSubscribeInfo(p.correlationID, b, this);
                p.subscriptionWaiting = r;
                this.session.subscribe(b, true, r)
            } else this.startCacheRequest(p)
        }
    };
    a.CacheSession.prototype.swallowChildReply =
        function() {};
    a.CacheSession.prototype.handleCacheRequestFailed = function(g, b, k) {
        this.terminateRequest(k.getRequestID(), a.CacheReturnCode.FAIL, a.CacheReturnSubcode.ERROR_RESPONSE)
    };
    a.CacheSession.prototype.registerRequest = function(g) {
        this.outstandingRequests[g.correlationID] = g;
        g.parentRequest || (this.outstandingIDs[g.requestID] = g)
    };
    a.CacheSession.prototype.getOutstandingRequest = function(g) {
        return this.outstandingRequests[g]
    };
    a.CacheSession.prototype.startCacheRequest = function(g, b, k, j) {
        var n = a.SolclientFactory.createMessage();
        g.getRequestID();
        n.setCorrelationId(g.correlationID);
        k ? n.setDestination(k) : n.setDestination(a.SolclientFactory.createTopic(this.properties.cachePrefix + g.cacheName));
        n.setReplyTo(a.SolclientFactory.createTopic(this.session.getSessionProperties().p2pInboxInUse));
        n.setDeliverToOne(g.cacheMessageType === a.CacheRequestType.GET_MSG_REQUEST);
        k = new a.SDTStreamContainer;
        k.addField(a.SDTFieldType.UINT32, g.cacheMessageType);
        k.addField(a.SDTFieldType.UINT32, a.CacheRequest.VERSION);
        k.addField(a.SDTFieldType.STRING,
            g.topic.getName());
        k.addField(a.SDTFieldType.UINT32, a.CacheRequest.REPLY_SIZE_LIMIT);
        typeof b === "number" && k.addField(a.SDTFieldType.UINT32, b);
        k.addField(a.SDTFieldType.UINT32, this.properties.maxMessages);
        k.addField(a.SDTFieldType.UINT32, this.properties.maxAgeSec);
        g.cacheMessageType === a.CacheRequestType.GET_MSG_REQUEST && k.addField(a.SDTFieldType.BOOL, this.properties.includeOtherClusters && !j);
        k.addField(a.SDTFieldType.BOOL, false);
        g.cacheMessageType === a.CacheRequestType.GET_MSG_REQUEST && k.addField(a.SDTFieldType.UINT32,
            Math.round(this.properties.timeoutMsec / 1E3));
        n.setSdtContainer(a.SDTField.create(a.SDTFieldType.STREAM, k));
        try {
            this.session.send(n);
            g.parentRequest || this.incStat(a.StatType.CACHE_REQUEST_SENT)
        } catch (p) {
            this.terminateRequest(g, a.CacheReturnCode.FAIL, a.CacheReturnSubcode.ERROR_RESPONSE, p)
        }
    };
    a.CacheSession.prototype.incStat = function(g, b) {
        this.session && this.session.m_sessionStatistics && this.session.m_sessionStatistics.incStat(g, b)
    };
    a.CacheSession.prototype.handleCacheRequestTimeout = function(g) {
        var b =
            g.cacheSession;
        b.getOutstandingRequest(g.correlationID) && b.terminateRequest(g.getRootRequest(), a.CacheReturnCode.INCOMPLETE, a.CacheReturnSubcode.REQUEST_TIMEOUT)
    };
    a.CacheSession.prototype.unregisterRequest = function(g) {
        delete this.outstandingRequests[g.correlationID];
        delete this.outstandingIDs[g.requestID]
    };
    a.CacheSession.prototype.notifyCallback = function(g, b, k, j, n) {
        var p = g.cbInfo;
        p.getCallback()(g.requestID, new a.CacheRequestResult(b, k, j, n), p.getUserObject())
    };
    a.CacheSession.prototype.trackCompletionStats =
        function(g, b) {
            switch (g) {
                case a.CacheReturnCode.OK:
                    this.incStat(a.StatType.CACHE_REQUEST_OK_RESPONSE);
                    b === a.CacheReturnSubcode.LIVE_DATA_FULFILL && this.incStat(a.StatType.CACHE_REQUEST_LIVE_DATA_FULFILL);
                    break;
                case a.CacheReturnCode.INCOMPLETE:
                    this.incStat(a.StatType.CACHE_REQUEST_INCOMPLETE_RESPONSE);
                    break;
                case a.CacheReturnCode.FAIL:
                    this.incStat(a.StatType.CACHE_REQUEST_FAIL_RESPONSE);
                    break;
                default:
                    throw Error("Sanity: no return code supplied");
            }
        };
    a.CacheSession.prototype.terminateRequest = function(g,
        b, k, j) {
        g = g.getRootRequest();
        if (this.outstandingRequests[g.correlationID]) {
            var n = g.cbInfo;
            if (n)
                if (n.getCallback()) {
                    n = g.getTopic();
                    for (var p = 0; p < g.queuedLiveData.length; p++) this.sendToNextDelegate(g.queuedLiveData[p]);
                    g.cancel();
                    this.unregisterRequest(g);
                    if (!g.liveDataFulfilled) {
                        this.trackCompletionStats(b, k);
                        this.notifyCallback(g, b, k, n, j)
                    }
                }
        }
    };
    a.CacheSessionProperties = function(g, b, k, j) {
        this.cacheName = g;
        this.maxAgeSec = b || 0;
        this.maxMessages = k === null || typeof k === "undefined" ? 1 : k;
        this.timeoutMsec = j || 1E4;
        this.includeOtherClusters = true;
        this.cachePrefix = "#P2P/CACHEINST/"
    };
    a.CacheSessionProperties.prototype.getCacheName = function() {
        return this.cacheName
    };
    a.CacheSessionProperties.prototype.setCacheName = function(g) {
        this.cacheName = g
    };
    a.CacheSessionProperties.prototype.getMaxMessageAgeSec = function() {
        return this.maxAgeSec
    };
    a.CacheSessionProperties.prototype.setMaxMessageAgeSec = function(g) {
        this.maxAgeSec = g
    };
    a.CacheSessionProperties.prototype.getMaxMessages = function() {
        return this.maxMessages
    };
    a.CacheSessionProperties.prototype.setMaxMessages =
        function(g) {
            this.maxMessages = g
        };
    a.CacheSessionProperties.prototype.getTimeoutMsec = function() {
        return this.timeoutMsec
    };
    a.CacheSessionProperties.prototype.setTimeoutMsec = function(g) {
        this.timeoutMsec = g
    };
    a.CacheSessionSubscribeInfo = function(g, b, k) {
        this.correlationID = g;
        this.topic = b;
        this.cacheSession = k
    };
    a.CacheMessageRxCBInfo = function() {
        a.MessageRxCBInfo.apply(this, arguments)
    }
})(solace);
(function(a) {
    a.TsSmf = function() {
        function g() {
            return a.Convert.int32ToStr(51642369) + a.Convert.int32ToStr(12)
        }
        return {
            genTsCreateHeader: function() {
                return g() + a.Convert.int32ToStr(22) + a.Convert.int16ToStr(32778) + a.Convert.int32ToStr(0) + a.Convert.int32ToStr(0)
            },
            genTsDestroyHeader: function(b) {
                return g() + a.Convert.int32ToStr(22) + a.Convert.int16ToStr(33290) + b
            },
            genTsDataTokenMsg: function(b) {
                return a.Convert.int32ToStr(60030977) + a.Convert.int32ToStr(12) + a.Convert.int32ToStr(22) + a.Convert.int16ToStr(34058) +
                    b
            },
            genTsDataStreamTokenMsg: function(b) {
                return a.Convert.int32ToStr(60030977) + a.Convert.int32ToStr(12) + a.Convert.int32ToStr(24) + a.Convert.int16ToStr(34316) + b + a.Convert.int16ToStr(0)
            },
            genTsDataMsgHeaderParts: function(b) {
                return [a.Convert.int32ToStr(60030977) + a.Convert.int32ToStr(12), a.Convert.int16ToStr(33802) + b]
            }
        }
    }()
})(solace);
(function(a) {
    function g() {
        this.PacketReadState = r.SMF_NEW;
        this.TopSmfHeader = null;
        this.TotalPayloadToRead = 0;
        this.TransportMessageCurrent = null;
        this.m_bytesRead = 0;
        this.m_inputbuf = "";
        this.remaining = function() {
            return this.m_inputbuf.length - this.m_bytesRead
        };
        this.enqueue = function(d) {
            this.m_inputbuf += d
        };
        this.getBuffer = function() {
            return this.m_inputbuf
        };
        this.advanceBuffer = function(d) {
            this.m_bytesRead += d;
            if (this.m_bytesRead === this.m_inputbuf.length) {
                this.m_bytesRead = 0;
                this.m_inputbuf = ""
            }
        };
        this.position = function() {
            return this.m_bytesRead
        }
    }

    function b(d, h) {
        return d.m_queuedDataSize === 0 || h + d.m_queuedDataSize <= d.m_sendBufferMaxSize
    }

    function k(d) {
        d.m_alertOnDequeue = true;
        return 2
    }

    function j(d) {
        var h = "",
            e = d.m_maxPayloadBytes;
        if (d.getBufferedAmount) {
            e = d.m_maxPayloadBytes - d.getBufferedAmount();
            if (e <= 0) {
                if (d.m_bufferedAmountQueryIntervalInMsecs * d.m_bufferedAmountQueryIntervalDelayMultiplier <= 4E3) d.m_bufferedAmountQueryIntervalDelayMultiplier *= 2;
                return h
            } else d.m_bufferedAmountQueryIntervalDelayMultiplier = 1
        }
        if (d.m_queuedDataSize > e) {
            e = e;
            for (var i,
                    l; e && d.m_queuedDataSize;) {
                i = d.m_queuedData[0];
                l = i.length;
                if (l > e) {
                    h += i.substr(0, e);
                    d.m_queuedData[0] = i.substr(e);
                    d.m_queuedDataSize -= e;
                    e = 0
                } else {
                    h += d.m_queuedData.shift();
                    e -= l;
                    d.m_queuedDataSize -= l;
                    d.m_clientstats.msgWritten++
                }
            }
        } else {
            h = d.m_queuedData.join("");
            d.m_clientstats.msgWritten += d.m_queuedData.length;
            d.m_queuedData = [];
            d.m_queuedDataSize = 0
        }
        return h
    }

    function n(d, h, e, i, l) {
        this.m_incomingBuffer = "";
        this.m_rxSmfCB = h;
        this.m_rxMessageErrorCB = e;
        this.m_rxTransportEventCB = i;
        this.m_correlationCounter = 0;
        this.m_session = l;
        var c = this;
        switch (d.transportProtocol) {
            case a.TransportProtocol.HTTP_BASE64:
            case a.TransportProtocol.HTTP_BINARY:
            case a.TransportProtocol.HTTP_BINARY_STREAMING:
                this.m_transportSession = new a.HTTPTransportSession(d.url, function(f) {
                    c.handleTransportEvent(f)
                }, function(f) {
                    c.rxDataCB(f)
                }, d);
                break;
            case a.TransportProtocol.WS_BINARY:
                this.m_transportSession = new a.WebSocketTransportSession(d.url, function(f) {
                    c.handleTransportEvent(f)
                }, function(f) {
                    c.rxDataCB(f)
                }, d);
                break;
            default:
                throw new a.OperationError("No transport session provider for scheme: " +
                    d.transportProtocol, a.ErrorSubcode.INTERNAL_CONNECTION_ERROR, d.transportProtocol);
        }
    }

    function p(d) {
        function h() {
            this.m_ssl = false;
            this.m_transportProtocol = p.defaultTransportProtocol;
            this.m_transportFamily = a.TransportFamily.HTTP;
            this.m_unsupportedRuntimeMessage = "not supported by this runtime: " + (window && window.navigator ? window.navigator.userAgent : "(unknown)");
            this.m_nextStateOnFail = null;
            this.m_name = "PARENT";
            this.shouldRetry = function() {
                return this.m_nextStateOnFail !== null
            };
            this.getTransportProtocol = function() {
                return this.m_transportProtocol
            };
            this.getTransportFamily = function() {
                return this.m_transportFamily
            };
            this.handleConnectFailed = function(m) {
                this.m_nextStateOnFail && f.switchState(this.m_nextStateOnFail, m)
            };
            this.validateLegal = function() {};
            this.toString = function() {
                return this.m_transportProtocol + (this.m_ssl ? " (SSL)" : "")
            };
            this.setUseSsl = function(m) {
                this.m_ssl = !!m
            };
            this.getUseSsl = function() {
                return this.m_ssl
            }
        }

        function e(m) {
            this.setUseSsl(m);
            this.m_transportProtocol = a.TransportProtocol.HTTP_BASE64;
            this.m_transportFamily = this.getUseSsl() ? a.TransportFamily.HTTPS :
                a.TransportFamily.HTTP;
            this.m_nextStateOnFail = null;
            this.m_name = this.m_transportProtocol.toString()
        }

        function i(m) {
            this.setUseSsl(m);
            this.m_transportProtocol = a.TransportProtocol.HTTP_BINARY;
            this.m_transportFamily = this.getUseSsl() ? a.TransportFamily.HTTPS : a.TransportFamily.HTTP;
            this.m_nextStateOnFail = new e(m);
            this.validateLegal = function() {
                a.HttpConnection.browserSupportsXhrBinary() || f.switchState(this.m_nextStateOnFail, this.m_unsupportedRuntimeMessage)
            }
        }

        function l(m) {
            this.setUseSsl(m);
            this.m_transportProtocol =
                a.TransportProtocol.HTTP_BINARY_STREAMING;
            this.m_transportFamily = this.getUseSsl() ? a.TransportFamily.HTTPS : a.TransportFamily.HTTP;
            this.m_nextStateOnFail = new i(m);
            this.m_name = this.m_transportProtocol.toString();
            this.validateLegal = function() {
                a.HttpConnection.browserSupportsStreamingResponse() && a.HttpConnection.browserSupportsXhrBinary() || f.switchState(this.m_nextStateOnFail, this.m_unsupportedRuntimeMessage)
            }
        }

        function c(m) {
            this.setUseSsl(m);
            this.m_transportProtocol = a.TransportProtocol.WS_BINARY;
            this.m_transportFamily =
                this.getUseSsl() ? a.TransportFamily.WSS : a.TransportFamily.WS;
            this.m_nextStateOnFail = new l(m);
            this.m_name = this.m_transportProtocol.toString();
            this.validateLegal = function() {
                a.WebSocketConnection.browserSupportsBinaryWebSockets() || f.switchState(this.m_nextStateOnFail, this.m_unsupportedRuntimeMessage)
            }
        }
        var f = this;
        e.prototype = new h;
        i.prototype = new h;
        l.prototype = new h;
        c.prototype = new h;
        this.getTransportProtocol = function() {
            return f.m_state.getTransportProtocol()
        };
        this.getTransportFamily = function() {
            return f.m_state.getTransportFamily()
        };
        this.handleConnectFailed = function(m) {
            f.m_state.handleConnectFailed(m)
        };
        this.shouldRetry = function() {
            return f.m_state.shouldRetry()
        };
        this.useSsl = function() {
            return f.m_state.getUseSsl()
        };
        this.toString = function() {
            return f.m_state.toString()
        };
        this.switchState = function(m) {
            f.m_state = m;
            m.validateLegal()
        };
        this.validateProperties = function() {
            var m = (d.url || "").split("://");
            if (!(m.length && p.validSchemes.indexOf(m[0]) >= 0)) throw new a.OperationError("Invalid parameter for url: Only [" + p.validSchemes.join(", ") +
                "] URL schemes are supported", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        };
        var o = {};
        o[a.TransportProtocol.HTTP_BINARY_STREAMING] = l;
        o[a.TransportProtocol.HTTP_BINARY] = i;
        o[a.TransportProtocol.HTTP_BASE64] = e;
        o[a.TransportProtocol.WS_BINARY] = c;
        this.setProtocol = function(m) {
            var s;
            s = d.url.toLowerCase().indexOf("s://") > 1;
            this.m_state = new o[m](s);
            this.m_state.validateLegal()
        };
        this.setProtocol(d.transportProtocol || p.defaultProtocol)
    }
    a.TransportSessionEvent = function(d, h, e, i) {
        this.m_sessionEventCode = d;
        this.m_infoStr =
            h;
        this.m_responseCde = e;
        this.m_sid = i
    };
    a.TransportSessionEvent.prototype.getSessionEventCode = function() {
        return this.m_sessionEventCode
    };
    a.TransportSessionEvent.prototype.getInfoStr = function() {
        return this.m_infoStr
    };
    a.TransportSessionEvent.prototype.getResponseCode = function() {
        return this.m_responseCde
    };
    a.TransportSessionEvent.prototype.getSessionId = function() {
        return this.m_sid
    };
    a.TransportSessionEvent.prototype.toString = function() {
        var d = new a.StringBuffer("Transport session event: ");
        d.append("sessionEventCode=").append(this.m_sessionEventCode).append(", ");
        d.append("infoStr=").append(this.m_infoStr || "").append(", ");
        d.append("responseCode=").append(this.m_responseCde || "").append(", ");
        d.append("sid=").append(this.m_sid ? a.Util.formatHexString(this.m_sid) : "N/A");
        return d.toString()
    };
    var r = {
        SMF_NEW: 0,
        SMF_HEADER_READ: 1,
        TRANSPORT_HEADER_READ: 2
    };
    a.TransportClientStats = function() {
        this.msgWritten = this.bytesWritten = 0
    };
    a.TransportSessionBase = function(d, h, e) {
        this.m_connectTimeout = e.transportDowngradeTimeoutInMsecs;
        this.m_connectTimer = null;
        this.m_clientstats = new a.TransportClientStats;
        this.m_dataCB = h;
        this.m_eventCB = d;
        this.m_state = 0;
        this.m_sendBufferMaxSize = e.sendBufferMaxSize;
        this.m_maxPayloadBytes = e.maxWebPayload;
        this.m_queuedData = [];
        this.m_queuedDataSize = 0;
        this.m_alertOnDequeue = false;
        var i = this;
        this.createConnectTimeout = function() {
            if (this.m_connectTimeout > 0) this.m_connectTimer = setTimeout(function() {
                i.connectTimerExpiry()
            }, this.m_connectTimeout)
        };
        this.cancelConnectTimeout = function() {
            if (this.m_connectTimer) {
                clearTimeout(this.m_connectTimer);
                this.m_connectTimer = null
            }
        };
        this.connectTimerExpiry =
            function() {};
        this.getClientStats = function() {
            return this.m_clientstats
        }
    };
    a.WebSocketTransportSession = function(d, h, e, i) {
        a.TransportSessionBase.apply(this, [h, e, i]);
        this.m_streamInputReadState = new g;
        this.m_url = "ws" + d.match(/(ws|http)(s?:\/\/.+)/)[2];
        this.m_sessionId = this.m_webSocket = null;
        this.m_bufferedAmountQueryIntervalInMsecs = i.bufferedAmountQueryIntervalInMsecs;
        this.m_bufferedAmountQueryTimer = null;
        this.m_bufferedAmountQueryIntervalDelayMultiplier = 1;
        this.connectTimerExpiry = function() {
            this.state = 5;
            this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CONNECTION_ERROR, "timeout", null))
        }
    };
    a.WebSocketTransportSession.prototype.onClose = function(d) {
        this.m_state = 5;
        this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CONNECTION_ERROR, "Connection closed" + (d.reason ? ": " + d.reason : ""), null))
    };
    a.WebSocketTransportSession.prototype.onConnect = function() {
        this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.UP_NOTICE, "Connected", 0, this.m_sessionId))
    };
    a.WebSocketTransportSession.prototype.onError =
        function() {
            this.m_state = 5;
            this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CONNECTION_ERROR, "Connection error", null))
        };
    a.WebSocketTransportSession.prototype.onData = function(d) {
        this.cancelConnectTimeout();
        var h = this.m_streamInputReadState;
        h.enqueue(d);
        var e;
        for (d = true; d;) {
            d = false;
            switch (h.PacketReadState) {
                case r.SMF_NEW:
                    if (e = a.smf.Codec.parseSmfAt(h.getBuffer(), h.position())) {
                        h.PacketReadState = r.SMF_HEADER_READ;
                        h.TopSmfHeader = e;
                        d = true
                    }
                    break;
                case r.SMF_HEADER_READ:
                    e = h.TopSmfHeader;
                    e = e.m_headerLength + e.m_payloadLength;
                    var i = h.remaining();
                    if (this.m_dataCB && i >= e) {
                        this.m_dataCB(h.getBuffer().substr(h.position(), e));
                        h.advanceBuffer(e);
                        h.PacketReadState = r.SMF_NEW;
                        d = i > e
                    }
            }
        }
    };
    a.WebSocketTransportSession.prototype.connect = function() {
        var d = this;
        if (this.m_state !== 0) return 4;
        if (!this.m_url) return 5;
        try {
            this.m_webSocket = new a.WebSocketConnection(this.m_url, function() {
                d.onConnect()
            }, function(i) {
                d.onData(i)
            }, function(i) {
                d.onError(i)
            }, function(i) {
                d.onClose(i)
            });
            this.m_webSocket.binaryType =
                "arraybuffer"
        } catch (h) {
            return this.m_state = 5
        }
        this.createConnectTimeout();
        try {
            this.m_webSocket.connect();
            this.m_state = 2;
            return 0
        } catch (e) {
            this.m_state = 5;
            this.cancelConnectTimeout();
            throw e;
        }
    };
    a.WebSocketTransportSession.prototype.send = function(d, h) {
        if (this.m_state !== 2) return 4;
        if (this.m_queuedData.length > 0) return this.enqueueData(d, h);
        var e = this.m_maxPayloadBytes - this.getBufferedAmount();
        if (e <= 0) return this.enqueueData(d, h);
        var i = null;
        if (d.length > e) {
            i = d.substr(e);
            d = d.substr(0, e);
            if (!b(this, i.length)) return k(this)
        }
        this.m_webSocket.send(d);
        this.m_clientstats.bytesWritten += d.length;
        if (i) return this.enqueueData(i, true);
        else {
            this.m_clientstats.msgWritten++;
            return 0
        }
    };
    a.WebSocketTransportSession.prototype.getBufferedAmount = function() {
        if (this.m_webSocket) return this.m_webSocket.getBufferedAmount()
    };
    a.WebSocketTransportSession.prototype.enqueueData = function(d, h) {
        var e = d.length;
        if (h || b(this, e)) {
            this.m_queuedDataSize += e;
            this.m_queuedData.push(d)
        } else return k(this);
        this.m_bufferedAmountQueryTimer || this.scheduleQuery();
        return 0
    };
    a.WebSocketTransportSession.prototype.scheduleQuery =
        function() {
            if (this.m_queuedDataSize > 0 && this.m_bufferedAmountQueryIntervalInMsecs > 0) {
                this.cancelQuery();
                var d = this;
                this.m_bufferedAmountQueryTimer = setTimeout(function() {
                    try {
                        d.cancelQuery();
                        d.sendQueuedData()
                    } catch (h) {}
                }, this.m_bufferedAmountQueryIntervalInMsecs * this.m_bufferedAmountQueryIntervalDelayMultiplier)
            }
        };
    a.WebSocketTransportSession.prototype.cancelQuery = function() {
        if (this.m_bufferedAmountQueryTimer) {
            clearTimeout(this.m_bufferedAmountQueryTimer);
            this.m_bufferedAmountQueryTimer = null
        }
    };
    a.WebSocketTransportSession.prototype.sendQueuedData =
        function() {
            if (this.m_queuedDataSize !== 0) {
                var d = j(this);
                if (d.length > 0) {
                    this.m_clientstats.bytesWritten += d.length;
                    this.m_webSocket.send(d)
                }
                this.scheduleQuery();
                if (this.m_alertOnDequeue && this.m_queuedDataSize < this.m_sendBufferMaxSize) {
                    this.m_alertOnDequeue = false;
                    this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CAN_ACCEPT_DATA, "", 0, this.m_sessionId))
                }
            }
        };
    a.WebSocketTransportSession.prototype.destroy = function() {
        if (this.m_state === 0 && !this.m_webSocket) return 0;
        this.m_webSocket.destroy();
        if (this.m_connectTimer) {
            clearTimeout(this.m_connectTimer);
            this.m_connectTimer = null
        }
        this.cancelQuery();
        this.m_webSocket = null;
        this.m_queuedData = [];
        this.m_queuedDataSize = 0;
        this.m_alertOnDequeue = false;
        this.m_bufferedAmountQueryIntervalDelayMultiplier = 1;
        this.m_state = 0;
        if (this.m_eventCB) {
            var d = this;
            setTimeout(function() {
                d.m_eventCB && d.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.DESTROYED_NOTICE, "Session is destroyed", 0, d.m_sessionId));
                d.m_dataCB = null;
                d.m_eventCB = null
            }, 0)
        }
        return 0
    };
    a.HTTPTransportSession = function(d, h, e, i) {
        a.TransportSessionBase.apply(this, [h, e, i]);
        this.m_haveToken = true;
        this.m_confMaxWebPayload = i.maxWebPayload;
        this.m_maxPayloadBytes = 0;
        this.m_destroyTimer = null;
        this.m_destroyTimeout = i.connectTimeoutInMsecs;
        this.m_applianceUrl = this.m_createUrl = "http" + d.match(/.+?(s?:\/\/.+)/)[1];
        this.m_smfDataTokenTSHeader = this.m_httpReceiveConn = this.m_httpSendConn = null;
        this.m_routerTag = "";
        this.m_sid = null;
        this.m_streamInputReadState = new g;
        if (i.transportProtocol === null) throw new a.OperationError("transportProtocol is null",
            a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        this.m_transportProtocol = i.transportProtocol;
        this.m_useStreamingTransport = this.m_useBinaryTransport = false;
        this.m_useBinaryTransport = i.transportProtocol !== a.TransportProtocol.HTTP_BASE64;
        this.m_useStreamingTransport = i.transportProtocol === a.TransportProtocol.HTTP_BINARY_STREAMING;
        if (i.transportContentType === null) throw new a.OperationError("transportContentType is null", a.ErrorSubcode.PARAMETER_OUT_OF_RANGE);
        this.m_contentType = i.transportContentType;
        this.connectTimerExpiry =
            function() {
                this.destroyCleanup(true, "Timeout during connection create", a.ErrorSubcode.INTERNAL_CONNECTION_ERROR)
            }
    };
    a.HTTPTransportSession.prototype.getSessionIdForLogging = function() {
        return " (sessionId=" + (this.m_sid ? a.Util.formatHexString(this.m_sid) : "") + ")"
    };
    a.HTTPTransportSession.prototype.updateMaxWebPayload = function() {
        var d = this.m_confMaxWebPayload - 22;
        this.m_maxPayloadBytes = this.m_useBinaryTransport ? d : Math.floor(d * 0.75)
    };
    a.HTTPTransportSession.prototype.connect = function() {
        if (this.m_state !== 0) return 4;
        this.connectInternal();
        return 0
    };
    a.HTTPTransportSession.prototype.connectInternal = function() {
        var d = this;
        try {
            this.m_createConn = new a.HttpConnection(this.m_createUrl, !this.m_useBinaryTransport, false, function(l, c) {
                d.handleCreateResponse(l, c)
            }, function(l, c) {
                d.handleCreateConnFailure(l, c)
            }, this.m_contentType)
        } catch (h) {
            return 5
        }
        if (typeof this.m_createConn === "undefined" || this.m_createConn === null) return 5;
        var e = a.TsSmf.genTsCreateHeader();
        if (this.m_state !== 1) {
            this.createConnectTimeout();
            this.m_state = 1;
            this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CONNECTING,
                "Connection in progress", 0, 0))
        }
        try {
            this.m_createConn.send(e)
        } catch (i) {
            this.m_state = 5;
            this.cancelConnectTimeout();
            throw i;
        }
    };
    a.HTTPTransportSession.prototype.destroy = function(d, h, e) {
        if (this.m_state === 4 || this.m_state === 0) return 0;
        if (this.m_state === 5 || this.m_state === 1) {
            this.destroyCleanup(true, h, e, true);
            return 0
        }
        if (d || this.m_haveToken) {
            this.m_state = 4;
            this.m_httpSendConn !== null && this.m_httpSendConn.abort();
            this.m_httpReceiveConn !== null && this.m_httpReceiveConn.abort();
            var i = this;
            this.m_destroyTimer = setTimeout(function() {
                    i.destroyTimerExpiry()
                },
                this.m_destroyTimeout);
            this.m_httpSendConn !== null && this.m_httpSendConn.send(a.TsSmf.genTsDestroyHeader(this.m_sid))
        } else this.m_state = 3;
        return 0
    };
    a.HTTPTransportSession.prototype.send = function(d, h) {
        if (this.m_state !== 2) return 4;
        if (this.m_queuedData.length > 0 || !this.m_haveToken) return this.enqueueData(d, h);
        var e = null;
        if (d.length > this.m_maxPayloadBytes) {
            e = d.substr(this.m_maxPayloadBytes);
            d = d.substr(0, this.m_maxPayloadBytes);
            if (!b(this, e.length)) return k(this)
        }
        this.m_haveToken = false;
        this.m_httpSendConn.send(this.m_smfDataTSHeaderParts[0] +
            a.Convert.int32ToStr(this.m_smfDataTSHeaderParts[0].length + 4 + this.m_smfDataTSHeaderParts[1].length + d.length) + this.m_smfDataTSHeaderParts[1] + d);
        this.m_clientstats.bytesWritten += d.length;
        if (e) return this.enqueueData(e);
        else {
            this.m_clientstats.msgWritten++;
            return 0
        }
    };
    a.HTTPTransportSession.prototype.enqueueData = function(d, h) {
        var e = d.length;
        if (h || b(this, e)) {
            this.m_queuedDataSize += e;
            this.m_queuedData.push(d)
        } else return k(this);
        return 0
    };
    a.HTTPTransportSession.prototype.initPreformattedHeaders = function(d) {
        this.m_smfDataTSHeaderParts =
            a.TsSmf.genTsDataMsgHeaderParts(d);
        this.m_smfDataTokenTSHeader = this.m_useStreamingTransport ? a.TsSmf.genTsDataStreamTokenMsg(d) : a.TsSmf.genTsDataTokenMsg(d)
    };
    a.HTTPTransportSession.prototype.sendQueuedData = function() {
        if (this.m_queuedDataSize === 0) this.m_state === 3 && this.destroy(false);
        else {
            this.m_haveToken = false;
            var d = j(this);
            this.m_httpSendConn.send(this.m_smfDataTSHeaderParts[0] + a.Convert.int32ToStr(this.m_smfDataTSHeaderParts[0].length + 4 + this.m_smfDataTSHeaderParts[1].length + d.length) + this.m_smfDataTSHeaderParts[1] +
                d);
            this.m_clientstats.bytesWritten += d.length;
            if (this.m_alertOnDequeue) {
                this.m_alertOnDequeue = false;
                this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CAN_ACCEPT_DATA, "", 0, this.m_sid))
            }
        }
    };
    a.HTTPTransportSession.prototype.handleCreateResponse = function(d, h) {
        if (!(this.m_state === 4 || this.m_state === 0)) {
            this.updateMaxWebPayload();
            if (d !== 0) d === 3 ? this.destroyCleanup(true, "Received data decode error on create session response", a.ErrorSubcode.DATA_DECODE_ERROR) : this.destroyCleanup(true, "Failed to handle create session response",
                a.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
            else if (h.length !== 0) {
                var e = a.smf.Codec.decodeCompoundMessage(h, 0);
                if (e) {
                    var i = e.getResponse();
                    if (i.ResponseCode !== 200) this.destroyCleanup(true, "Transport create request failed: response code - " + i.ResponseCode + ", " + i.ResponseCode, a.ErrorSubcode.INTERNAL_CONNECTION_ERROR);
                    else {
                        this.m_createConn.abort();
                        this.m_createConn = null;
                        this.m_state = 2;
                        this.m_sid = e.SessionId;
                        this.m_routerTag = e.RouterTag;
                        this.m_applianceUrl = this.m_createUrl.replace(/\?.*/, "");
                        if (this.m_routerTag !==
                            "") this.m_applianceUrl += this.m_routerTag;
                        this.initPreformattedHeaders(this.m_sid);
                        var l = this;
                        this.m_httpSendConn = new a.HttpConnection(this.m_applianceUrl, !this.m_useBinaryTransport, false, function(c, f) {
                            l.handleRxDataToken(c, f)
                        }, function(c, f) {
                            l.handleConnFailure(c, f)
                        }, this.m_contentType);
                        this.m_httpReceiveConn = new a.HttpConnection(this.m_applianceUrl, !this.m_useBinaryTransport, this.m_useStreamingTransport, function(c, f) {
                            l.handleRxData(c, f)
                        }, function(c, f) {
                            l.handleConnFailure(c, f)
                        }, this.m_contentType);
                        this.m_httpReceiveConn.send(this.m_smfDataTokenTSHeader);
                        this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.UP_NOTICE, i.ResponseString, 0, e.SessionId))
                    }
                } else this.destroyCleanup(true, "Failed to parse create response message", a.ErrorSubcode.INTERNAL_CONNECTION_ERROR)
            }
        }
    };
    a.HTTPTransportSession.prototype.handleDestroyResponse = function(d) {
        this.cancelDestroyTimeout();
        var h = d.getResponse().ResponseString || "";
        h += " Handled Destroy Response addressed to session " + a.Util.formatHexString(d.SessionId) +
            ", on session " + a.Util.formatHexString(this.m_sid);
        this.destroyCleanup(true, h)
    };
    a.HTTPTransportSession.prototype.handleRxData = function(d, h) {
        if (this.m_httpReceiveConn !== null) {
            this.cancelConnectTimeout();
            this.m_httpReceiveConn.recStat("GotData");
            if (d !== 0) return this.handleRxError(d, h);
            if (h.length === 0) {
                this.m_streamInputReadState.PacketReadState = r.SMF_NEW;
                this.m_httpReceiveConn.send(this.m_smfDataTokenTSHeader)
            } else {
                var e = this.m_streamInputReadState;
                e.enqueue(h);
                for (var i = true; i;) switch (e.PacketReadState) {
                    case r.SMF_NEW:
                        var l =
                            a.smf.Codec.parseSmfAt(e.getBuffer(), e.position());
                        if (l) {
                            e.advanceBuffer(l.m_headerLength);
                            e.TopSmfHeader = l;
                            e.TotalPayloadToRead = l.m_payloadLength;
                            e.PacketReadState = r.SMF_HEADER_READ
                        } else i = false;
                        break;
                    case r.SMF_HEADER_READ:
                        if (l = a.smf.Codec.TsSmf.parseTsSmfHdrAt(e.getBuffer(), e.position(), e.TopSmfHeader)) {
                            e.advanceBuffer(l.TsHeaderLength);
                            e.TransportMessageCurrent = l;
                            e.TotalPayloadToRead -= l.TsHeaderLength;
                            e.PacketReadState = r.TRANSPORT_HEADER_READ
                        } else i = false;
                        break;
                    case r.TRANSPORT_HEADER_READ:
                        l =
                            e.TransportMessageCurrent;
                        switch (e.TransportMessageCurrent.MessageType) {
                            case 3:
                                this.handleDestroyResponse(l);
                                return;
                            case 4:
                                if (l.SessionId !== this.m_sid) {
                                    e = (e = l.getResponse()) ? " (" + e.ResponseCode + " " + e.ResponseString + ")" : "";
                                    this.m_state = 5;
                                    this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.PARSE_FAILURE, "Session ID mismatch in data message, expected: " + a.Util.formatHexString(this.m_sid) + ", got: " + a.Util.formatHexString(l.SessionId) + ", " + e, a.ErrorSubcode.PROTOCOL_ERROR, this.m_sid));
                                    return
                                }
                                if (e.remaining() > 0) {
                                    l = Math.min(e.remaining(), e.TotalPayloadToRead);
                                    var c = e.getBuffer().substr(e.position(), l);
                                    e.advanceBuffer(l);
                                    e.TotalPayloadToRead -= l;
                                    this.m_dataCB(c);
                                    if (e.TotalPayloadToRead === 0) {
                                        e.PacketReadState = r.SMF_NEW;
                                        if (e.remaining() === 0) break
                                    }
                                } else i = false;
                                break;
                            default:
                                throw new a.TransportError("Unexpected message type (" + l.MessageType + ") on ReceiveData connection", 0);
                        }
                }
            }
        }
    };
    a.HTTPTransportSession.prototype.handleRxDataToken = function(d, h) {
        if (d !== 0) return this.handleRxError(d, h);
        if (h.length !== 0) {
            var e = a.smf.Codec.decodeCompoundMessage(h, 0);
            if (e)
                if (e.MessageType === 3) this.handleDestroyResponse(e);
                else if (e.SessionId !== this.m_sid) {
                var i = e.getResponse();
                i = i ? " (" + i.ResponseCode + " " + i.ResponseString + ")" : "";
                if (this.m_state !== 4) {
                    this.m_state = 5;
                    this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.PARSE_FAILURE, "Session ID mismatch in response message, expected: " + a.Util.formatHexString(this.m_sid) + ", got: " + a.Util.formatHexString(e.SessionId) + ", " + i, a.ErrorSubcode.PROTOCOL_ERROR,
                        this.m_sid))
                } else this.destroyCleanup(true, "Session ID mismatch in response message", a.ErrorSubcode.PROTOCOL_ERROR)
            } else if (e.MessageType === 5 || e.MessageType === 6) {
                this.m_haveToken = true;
                this.m_httpSendConn.recStat("GotToken");
                this.sendQueuedData()
            } else throw new a.TransportError("Unexpected message type (" + e.MessageType + ") on SendData connection", 0);
            else if (this.m_state !== 4) {
                this.m_state = 5;
                this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.PARSE_FAILURE, "Failed to parse received data message",
                    a.ErrorSubcode.PROTOCOL_ERROR, this.m_sid))
            } else this.destroyCleanup(true)
        }
    };
    a.HTTPTransportSession.prototype.handleRxError = function(d) {
        this.m_state = 5;
        d === 3 ? this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.DATA_DECODE_ERROR, "Received data decode error", a.ErrorSubcode.DATA_DECODE_ERROR, this.m_sid)) : this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CONNECTION_ERROR, "Connection error", a.ErrorSubcode.INTERNAL_CONNECTION_ERROR, this.m_sid))
    };
    a.HTTPTransportSession.prototype.handleConnFailure =
        function(d, h) {
            if (this.m_state === 2) {
                this.m_state = 5;
                this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.CONNECTION_ERROR, "Connection error: " + h, a.ErrorSubcode.INTERNAL_CONNECTION_ERROR, this.m_sid))
            } else this.destroyCleanup(true, "Connection error: " + h, a.ErrorSubcode.INTERNAL_CONNECTION_ERROR)
        };
    a.HTTPTransportSession.prototype.handleCreateConnFailure = function(d, h) {
        this.m_state !== 0 && this.destroyCleanup(true, "Connection create failure: " + h, a.ErrorSubcode.INTERNAL_CONNECTION_ERROR)
    };
    a.HTTPTransportSession.prototype.destroyTimerExpiry =
        function() {
            this.destroyCleanup(true, "Destroy request timeout")
        };
    a.HTTPTransportSession.prototype.cancelDestroyTimeout = function() {
        if (this.m_destroyTimer) {
            clearTimeout(this.m_destroyTimer);
            this.m_destroyTimer = null
        }
    };
    a.HTTPTransportSession.prototype.destroyCleanup = function(d, h, e, i) {
        this.m_state = 4;
        this.m_createConn && this.m_createConn.abort();
        this.m_httpSendConn && this.m_httpSendConn.abort();
        this.m_httpReceiveConn && this.m_httpReceiveConn.abort();
        this.m_smfDataTokenTSHeader = this.m_httpReceiveConn = this.m_httpSendConn =
            this.m_createConn = this.m_applianceUrl = this.m_createUrl = null;
        this.m_routerTag = "";
        this.m_queuedData = [];
        this.m_queuedDataSize = 0;
        this.m_alertOnDequeue = false;
        this.cancelDestroyTimeout();
        this.cancelConnectTimeout();
        this.m_state = 0;
        if (i) {
            var l = this;
            setTimeout(function() {
                if (d) {
                    if (typeof e === "undefined") e = 0;
                    if (l.m_eventCB) l.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.DESTROYED_NOTICE, typeof h === "undefined" || h === null || h === "" ? "Session is destroyed" : h, e, l.m_sid))
                }
                l.m_dataCB = null;
                l.m_eventCB =
                    null
            }, 0)
        } else {
            if (d) {
                if (typeof e === "undefined") e = 0;
                if (this.m_eventCB) this.m_eventCB(new a.TransportSessionEvent(a.TransportSessionEventCode.DESTROYED_NOTICE, typeof h === "undefined" || h === null || h === "" ? "Session is destroyed" : h, e, this.m_sid))
            }
            this.m_eventCB = this.m_dataCB = null
        }
    };
    a.HTTPTransportSession.prototype.getInfoStr = function() {
        return "HttpTransportSession; sid=" + a.Util.formatHexString(this.m_sid) + "; routerTag=" + this.m_routerTag
    };
    n.prototype = {
        handleTransportEvent: function(d) {
            this.m_rxTransportEventCB &&
                this.m_rxTransportEventCB(d)
        },
        rxDataCB: function(d) {
            this.m_session && this.m_session.resetKeepAliveCounter();
            if (this.m_incomingBuffer.length === 0) this.m_incomingBuffer = d;
            else {
                this.m_incomingBuffer += d;
                if (this.m_incomingBuffer.length > 8E7) {
                    this.m_rxMessageErrorCB("Buffer overflow (length: " + this.m_incomingBuffer.length + ")");
                    this.m_incomingBuffer = ""
                }
            }
            for (d = 0; d < this.m_incomingBuffer.length && a.smf.Codec.isSmfAvailable(this.m_incomingBuffer, d);) {
                var h = a.smf.Codec.decodeCompoundMessage(this.m_incomingBuffer,
                    d);
                if (h && h.getSmfHeader()) {
                    d += h.getSmfHeader().m_messageLength;
                    this.m_rxSmfCB(h)
                } else {
                    this.m_incomingBuffer = "";
                    this.m_rxMessageErrorCB("Error parsing incoming SMF at position " + d);
                    return
                }
            }
            if (d < this.m_incomingBuffer.length) {
                h = this.m_incomingBuffer;
                this.m_incomingBuffer = h.substr(d, h.length - d)
            } else this.m_incomingBuffer = ""
        },
        connect: function() {
            return this.m_transportSession.connect()
        },
        cancelConnectTimeout: function() {
            this.m_transportSession.cancelConnectTimeout()
        },
        destroy: function(d, h, e) {
            return this.m_transportSession.destroy(d,
                h, e)
        },
        send: function(d, h) {
            return this.m_transportSession.send(a.smf.Codec.encodeCompoundMessage(d), h)
        },
        getTransportSession: function() {
            return this.m_transportSession
        },
        getClientStats: function() {
            return this.m_transportSession.getClientStats()
        },
        getTransportSessionInfoStr: function() {
            return this.m_transportSession.getInfoStr()
        },
        nextCorrelationTag: function() {
            return ++this.m_correlationCounter
        }
    };
    a.SMFClient = n;
    p.defaultProtocol = a.TransportProtocol.WS_BINARY;
    p.validSchemes = ["http", "https", "ws", "wss"];
    a.TransportProtocolHandler =
        p
})(solace);
(function(a) {
    function g(b, k, j, n, p) {
        this.url = b;
        this.socket = null;
        this.rxDataCb = j;
        this.connectionErrorCb = n;
        this.onCloseCB = p;
        this.onConnectCB = k
    }
    g.prototype.onOpen = function() {
        this.connCTS = true;
        this.onConnectCB()
    };
    g.prototype.onMessage = function(b) {
        this.rxDataCb(this.arrayBufferToString(b.data))
    };
    g.prototype.onClose = function(b) {
        this.onCloseCB(b)
    };
    g.prototype.onError = function(b) {
        this.connectionErrorCb(b)
    };
    g.prototype.connect = function() {
        this.socket && this.connectionErrorCb("Socket already connected");
        var b =
            this;
        try {
            this.socket = new WebSocket(this.url, "smf.solacesystems.com");
            this.socket.binaryType = "arraybuffer";
            this.socket.onopen = function(j) {
                b.onOpen(j)
            };
            this.socket.onmessage = function(j) {
                b.onMessage(j)
            };
            this.socket.onclose = function(j) {
                b.onClose(j)
            };
            this.socket.onerror = function(j) {
                b.onError(j)
            }
        } catch (k) {
            throw new a.TransportError("Could not create WebSocket: " + k, a.ErrorSubcode.CREATE_WEBSOCKET_FAILED);
        }
    };
    g.prototype.send = function(b) {
        this.socket && this.socket.send(this.stringToArrayBuffer(b))
    };
    g.prototype.destroy =
        function() {
            if (this.socket) {
                this.socket.close();
                this.socket.onopen = null;
                this.socket.onmessage = null;
                this.socket.onclose = null;
                this.socket = this.socket.onerror = null
            }
            this.onConnectCB = this.onCloseCB = this.connectionErrorCb = this.rxDataCb = null
        };
    g.prototype.getBufferedAmount = function() {
        if (this.socket) return this.socket.bufferedAmount;
        return 0
    };
    g.prototype.arrayBufferToString = function(b) {
        var k = b.byteLength;
        b = new Uint8Array(b);
        if (k < 32768) return String.fromCharCode.apply(null, b);
        else {
            for (var j = 0, n = ""; j < k;) {
                n +=
                    String.fromCharCode.apply(null, b.subarray(j, j + 32768));
                j += 32768
            }
            return n
        }
    };
    g.prototype.stringToArrayBuffer = function(b) {
        for (var k = new Uint8Array(new ArrayBuffer(b.length)), j = 0; j < b.length; j++) k[j] = b.charCodeAt(j);
        return k.buffer
    };
    g.browserSupportsBinaryWebSockets = function() {
        if (typeof WebSocket === "undefined" || typeof ArrayBuffer === "undefined" || typeof Uint8Array === "undefined") return false;
        return "binaryType" in WebSocket.prototype ? true : !!(window.WebSocket && (new WebSocket("ws://.")).binaryType)
    };
    a.WebSocketConnection =
        g
})(solace);
