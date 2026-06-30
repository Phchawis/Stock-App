/* @ds-bundle: {"format":3,"namespace":"TUHLabQMSDesignSystem_f1744f","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"DocTypeTag","sourcePath":"components/feedback/DocTypeTag.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"DOC_TYPES","sourcePath":"data/taxonomy.js"},{"name":"WORK_CATEGORIES","sourcePath":"data/taxonomy.js"},{"name":"DOC_STATUS","sourcePath":"data/taxonomy.js"},{"name":"ATTACH_FORMATS","sourcePath":"data/taxonomy.js"},{"name":"QMS_ACTIONS","sourcePath":"data/taxonomy.js"},{"name":"SAMPLE_DOCS","sourcePath":"data/taxonomy.js"}],"sourceHashes":{"components/core/Avatar.jsx":"ff7d01f88bce","components/core/Button.jsx":"611657019e52","components/core/Card.jsx":"ee7e5b5d3cc6","components/core/IconButton.jsx":"518c9203d76b","components/feedback/Alert.jsx":"5b745e255d7b","components/feedback/DocTypeTag.jsx":"387903583b01","components/feedback/StatusBadge.jsx":"a75d15657121","components/forms/Checkbox.jsx":"16eabd294451","components/forms/Input.jsx":"68334f2d7af9","components/forms/Select.jsx":"62ab9724ca83","components/navigation/Tabs.jsx":"7de8f96afaeb","data/taxonomy.js":"6edc2551c065","ui_kits/qms/AppShell.jsx":"4c6c0bb5c852","ui_kits/qms/DashboardScreen.jsx":"8a5e09f70d0e","ui_kits/qms/DocDetailScreen.jsx":"d7a1623a7f0b","ui_kits/qms/LoginScreen.jsx":"86608c1c8d6d","ui_kits/qms/RegisterScreen.jsx":"38f233872a34","ui_kits/qms/data.js":"466d531711cb","ui_kits/qms/ui.jsx":"fee7769fa38e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TUHLabQMSDesignSystem_f1744f = window.TUHLabQMSDesignSystem_f1744f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
/** Avatar — user identity chip. Initials fallback (Thai-aware), teal tint. */
function Avatar({
  name = '',
  src,
  size = 'md',
  style
}) {
  const dim = {
    sm: 28,
    md: 36,
    lg: 48
  }[size] || 36;
  const fontSize = {
    sm: 'var(--text-2xs)',
    md: 'var(--text-sm)',
    lg: 'var(--text-md)'
  }[size] || 'var(--text-sm)';
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('');
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'var(--teal-100)',
      color: 'var(--teal-800)',
      font: 'var(--fw-semibold) ' + fontSize + ' / 1 var(--font-display)',
      flexShrink: 0,
      userSelect: 'none',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the primary action control for TUH Lab QMS.
 * Clinical, restrained: small radius, quick transition, no bounce.
 */
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '0 12px',
      height: 32,
      fontSize: 'var(--text-sm)',
      gap: 6
    },
    md: {
      padding: '0 16px',
      height: 38,
      fontSize: 'var(--text-base)',
      gap: 8
    },
    lg: {
      padding: '0 22px',
      height: 46,
      fontSize: 'var(--text-md)',
      gap: 8
    }
  };
  const variants = {
    primary: {
      background: 'var(--teal-700)',
      color: 'var(--white)',
      border: '1px solid var(--teal-700)'
    },
    secondary: {
      background: 'var(--white)',
      color: 'var(--teal-700)',
      border: '1px solid var(--border-default)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'var(--red-600)',
      color: 'var(--white)',
      border: '1px solid var(--red-600)'
    },
    institutional: {
      background: 'var(--brand-800)',
      color: 'var(--white)',
      border: '1px solid var(--brand-800)'
    }
  };
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      font: 'var(--fw-semibold) ' + s.fontSize + " / 1 var(--font-body)",
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'filter var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)',
      whiteSpace: 'nowrap',
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(0.94)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Card — the default surface for grouped content. Optional header. */
function Card({
  padding = 'md',
  interactive = false,
  header,
  footer,
  children,
  style,
  ...rest
}) {
  const pad = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)'
  }[padding];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      ...style
    },
    onMouseEnter: e => {
      if (interactive) e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    },
    onMouseLeave: e => {
      if (interactive) e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }
  }, rest), header && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-6)',
      borderBottom: '1px solid var(--border-subtle)',
      font: 'var(--type-card-title)'
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: pad
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-6)',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--slate-50)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** IconButton — square, icon-only control for table rows & toolbars. */
function IconButton({
  size = 'md',
  variant = 'ghost',
  disabled = false,
  label,
  children,
  style,
  ...rest
}) {
  const dim = {
    sm: 30,
    md: 36,
    lg: 42
  }[size] || 36;
  const variants = {
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    outline: {
      background: 'var(--white)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)'
    },
    soft: {
      background: 'var(--teal-50)',
      color: 'var(--teal-700)',
      border: '1px solid transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = 'var(--slate-100)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = variants[variant].background;
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const TONES = {
  info: {
    fg: 'var(--blue-700)',
    bg: 'var(--blue-50)',
    bd: 'var(--blue-100)',
    bar: 'var(--blue-600)'
  },
  success: {
    fg: 'var(--green-700)',
    bg: 'var(--green-100)',
    bd: 'var(--green-100)',
    bar: 'var(--green-600)'
  },
  warning: {
    fg: 'var(--amber-700)',
    bg: 'var(--amber-100)',
    bd: 'var(--amber-100)',
    bar: 'var(--amber-600)'
  },
  danger: {
    fg: 'var(--red-700)',
    bg: 'var(--red-100)',
    bd: 'var(--red-100)',
    bar: 'var(--red-600)'
  }
};

/** Alert — inline notice. Left accent bar, no rounded-corner-with-colored-border trope. */
function Alert({
  tone = 'info',
  title,
  icon = null,
  children,
  style
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      background: t.bg,
      borderRadius: 'var(--radius-md)',
      borderLeft: '3px solid ' + t.bar,
      padding: 'var(--space-4) var(--space-5)',
      color: 'var(--text-primary)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.fg,
      flexShrink: 0,
      display: 'flex',
      marginTop: 2
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      font: 'var(--fw-semibold) var(--text-base)/1.4 var(--font-body)',
      color: t.fg
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/DocTypeTag.jsx
try { (() => {
// The 9 document types — colour-coded by family for fast scanning in the register.
const TYPES = {
  QM: {
    th: 'คู่มือคุณภาพ',
    c: 'var(--brand-700)'
  },
  SP: {
    th: 'ระเบียบปฏิบัติ',
    c: 'var(--blue-700)'
  },
  WI: {
    th: 'วิธีปฏิบัติ',
    c: 'var(--blue-600)'
  },
  WS: {
    th: 'แบบบันทึกการปฏิบัติงาน',
    c: 'var(--violet-700)'
  },
  FM: {
    th: 'แบบฟอร์มบันทึก',
    c: 'var(--violet-600)'
  },
  EF: {
    th: 'บันทึกอิเล็กทรอนิกส์',
    c: '#0E8A8A'
  },
  ED: {
    th: 'เอกสารอิเล็กทรอนิกส์',
    c: '#0A6E6E'
  },
  SD: {
    th: 'เอกสารสนับสนุน',
    c: 'var(--slate-600)'
  },
  RF: {
    th: 'เอกสารอ้างอิง',
    c: 'var(--gold-500)'
  }
};

/** DocTypeTag — the 2-letter document-type code chip used as a doc-number prefix marker. */
function DocTypeTag({
  type = 'QM',
  showLabel = false,
  size = 'md',
  style
}) {
  const t = TYPES[type] || TYPES.QM;
  const dim = size === 'sm' ? {
    code: 22,
    font: 'var(--text-2xs)'
  } : {
    code: 28,
    font: 'var(--text-xs)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: dim.code,
      height: dim.code,
      padding: '0 6px',
      borderRadius: 'var(--radius-sm)',
      background: t.c,
      color: 'var(--white)',
      font: 'var(--fw-bold) ' + dim.font + ' / 1 var(--font-mono)',
      letterSpacing: '0.02em'
    }
  }, type), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-secondary)'
    }
  }, t.th));
}
Object.assign(__ds_scope, { DocTypeTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/DocTypeTag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
const STATUS = {
  draft: {
    th: 'ร่าง',
    fg: 'var(--status-draft-fg)',
    bg: 'var(--status-draft-bg)',
    dot: 'var(--slate-500)'
  },
  review: {
    th: 'รอทบทวน',
    fg: 'var(--status-review-fg)',
    bg: 'var(--status-review-bg)',
    dot: 'var(--amber-600)'
  },
  approved: {
    th: 'อนุมัติแล้ว',
    fg: 'var(--status-approved-fg)',
    bg: 'var(--status-approved-bg)',
    dot: 'var(--blue-600)'
  },
  effective: {
    th: 'ประกาศใช้',
    fg: 'var(--status-effective-fg)',
    bg: 'var(--status-effective-bg)',
    dot: 'var(--green-600)'
  },
  obsolete: {
    th: 'ยกเลิกใช้งาน',
    fg: 'var(--status-obsolete-fg)',
    bg: 'var(--status-obsolete-bg)',
    dot: 'var(--red-600)'
  },
  controlled: {
    th: 'สำเนาควบคุม',
    fg: 'var(--status-controlled-fg)',
    bg: 'var(--status-controlled-bg)',
    dot: 'var(--violet-600)'
  }
};

/** StatusBadge — document-control state. The vocabulary is fixed by the QMS workflow. */
function StatusBadge({
  status = 'draft',
  label,
  size = 'md',
  style
}) {
  const s = STATUS[status] || STATUS.draft;
  const dims = size === 'sm' ? {
    padding: '2px 8px 2px 6px',
    fontSize: 'var(--text-2xs)',
    dot: 5,
    gap: 5
  } : {
    padding: '3px 10px 3px 8px',
    fontSize: 'var(--text-xs)',
    dot: 6,
    gap: 6
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: dims.gap,
      padding: dims.padding,
      borderRadius: 'var(--radius-pill)',
      background: s.bg,
      color: s.fg,
      font: 'var(--fw-semibold) ' + dims.fontSize + ' / 1 var(--font-body)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: dims.dot,
      height: dims.dot,
      borderRadius: '50%',
      background: s.dot,
      flexShrink: 0
    }
  }), label || s.th);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox — used for acknowledgement, bulk-select, filters. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    disabled: disabled,
    onChange: onChange,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: 18,
      height: 18,
      margin: 0,
      flexShrink: 0,
      border: '1.5px solid var(--border-strong)',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--white)',
      display: 'grid',
      placeItems: 'center',
      cursor: 'inherit',
      transition: 'background var(--dur-fast), border-color var(--dur-fast)'
    },
    ref: el => {
      if (!el) return;
      const on = el.checked;
      el.style.background = on ? 'var(--teal-700)' : 'var(--white)';
      el.style.borderColor = on ? 'var(--teal-700)' : 'var(--border-strong)';
      el.style.backgroundImage = on ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E\")" : 'none';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Input — labelled text field with optional hint / error / icon. */
function Input({
  label,
  hint,
  error,
  required = false,
  prefix = null,
  suffix = null,
  id,
  style,
  ...rest
}) {
  const inputId = id || (label ? 'in-' + label.replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-secondary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red-600)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--white)',
      border: '1px solid ' + (error ? 'var(--red-600)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      padding: '0 12px',
      height: 40,
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    },
    onFocusCapture: e => {
      e.currentTarget.style.borderColor = 'var(--border-brand)';
      e.currentTarget.style.boxShadow = 'var(--shadow-focus)';
    },
    onBlurCapture: e => {
      e.currentTarget.style.borderColor = error ? 'var(--red-600)' : 'var(--border-default)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      display: 'flex'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      minWidth: 0
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      display: 'flex'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--red-600)' : 'var(--text-tertiary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Select — native dropdown styled to match Input. */
function Select({
  label,
  hint,
  required = false,
  options = [],
  placeholder,
  id,
  style,
  ...rest
}) {
  const selId = id || (label ? 'sel-' + label.replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-secondary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red-600)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 40,
      padding: '0 36px 0 12px',
      background: 'var(--white)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      outline: 'none'
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--border-brand)';
      e.currentTarget.style.boxShadow = 'var(--shadow-focus)';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-tertiary)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs — underline-style navigation for switching register views / doc-detail panels. */
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, tabs.map(t => {
    const key = typeof t === 'string' ? t : t.value;
    const label = typeof t === 'string' ? t : t.label;
    const count = typeof t === 'object' ? t.count : undefined;
    const active = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(key),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 14px',
        marginBottom: -1,
        borderBottom: '2px solid ' + (active ? 'var(--teal-700)' : 'transparent'),
        color: active ? 'var(--teal-700)' : 'var(--text-secondary)',
        font: (active ? 'var(--fw-semibold) ' : 'var(--fw-medium) ') + 'var(--text-base)/1 var(--font-body)',
        transition: 'color var(--dur-fast), border-color var(--dur-fast)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-primary)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = 'var(--text-secondary)';
      }
    }, label, count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--fw-semibold) var(--text-2xs)/1 var(--font-mono)',
        background: active ? 'var(--teal-100)' : 'var(--slate-100)',
        color: active ? 'var(--teal-700)' : 'var(--text-tertiary)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-pill)'
      }
    }, count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// data/taxonomy.js
try { (() => {
/* ── TUH Lab QMS · taxonomy & sample data ───────────────────
   The controlled vocabularies for the lab quality document
   register. Imported by UI-kit screens and specimen cards so
   codes, colours and Thai labels stay consistent everywhere.

   Business data only — no styling here. */

// 9 document TYPES (ประเภทเอกสาร). `code` is the document-number prefix.
const DOC_TYPES = [{
  code: 'QM',
  th: 'คู่มือคุณภาพ',
  en: 'Quality Manual'
}, {
  code: 'SP',
  th: 'ระเบียบปฏิบัติ',
  en: 'Standard Procedure'
}, {
  code: 'WI',
  th: 'วิธีปฏิบัติ',
  en: 'Work Instruction'
}, {
  code: 'WS',
  th: 'แบบบันทึกการปฏิบัติงาน',
  en: 'Work Sheet'
}, {
  code: 'FM',
  th: 'แบบฟอร์มบันทึก',
  en: 'Form Sheet'
}, {
  code: 'EF',
  th: 'บันทึกอิเล็กทรอนิกส์',
  en: 'Electronic Form'
}, {
  code: 'ED',
  th: 'เอกสารอิเล็กทรอนิกส์',
  en: 'Electronic Document'
}, {
  code: 'SD',
  th: 'เอกสารสนับสนุน',
  en: 'Supporting Document'
}, {
  code: 'RF',
  th: 'เอกสารอ้างอิง',
  en: 'References'
}];

// 9 Work CATEGORIES (หมวดงาน). `code` is the section segment of the doc number.
const WORK_CATEGORIES = [{
  code: 'OUT',
  th: 'หมวดงานรับสิ่งส่งตรวจและห้องปฏิบัติการส่งต่อ',
  en: 'Specimen Receiving & Referral Lab'
}, {
  code: 'HEM',
  th: 'หมวดงานโลหิตวิทยา',
  en: 'Hematology'
}, {
  code: 'MIC',
  th: 'หมวดงานจุลทรรศนศาสตร์และปรสิตวิทยา',
  en: 'Microscopy & Parasitology'
}, {
  code: 'CHE',
  th: 'หมวดงานเคมีคลินิก',
  en: 'Clinical Chemistry'
}, {
  code: 'IMM',
  th: 'หมวดงานภูมิคุ้มกันวิทยา',
  en: 'Immunology'
}, {
  code: 'OPD',
  th: 'หมวดงานบริหารสิ่งส่งตรวจและบริการผู้ป่วยนอก รพธ.',
  en: 'Specimen Admin & OPD Service'
}, {
  code: 'THAMC',
  th: 'หมวดงานบริหารจัดการสิ่งส่งตรวจและบริการศูนย์การแพทย์',
  en: 'Specimen Management & Medical Centre Service'
}, {
  code: 'POC',
  th: 'หมวดงานบริหารจัดการเครื่องมือ ณ จุดดูแลผู้ป่วย',
  en: 'Point-of-Care Testing Management'
}, {
  code: 'CMTL',
  th: 'หมวดงานศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
  en: 'Medical Diagnostic Centre'
}, {
  code: 'ADS',
  th: 'หมวดงานธุรการและคลังพัสดุห้องปฏิบัติการ',
  en: 'Administration & Lab Supplies'
}, {
  code: 'DIL',
  th: 'หมวดงานเวชสารสนเทศห้องปฏิบัติการ',
  en: 'Laboratory Medical Informatics'
}];

// Document-control STATUS (สถานะเอกสาร) → maps to the --status-* tokens.
const DOC_STATUS = {
  draft: {
    th: 'ร่าง',
    en: 'Draft',
    token: 'draft'
  },
  review: {
    th: 'รอทบทวน',
    en: 'In Review',
    token: 'review'
  },
  approved: {
    th: 'อนุมัติแล้ว',
    en: 'Approved',
    token: 'approved'
  },
  effective: {
    th: 'ประกาศใช้',
    en: 'Effective',
    token: 'effective'
  },
  obsolete: {
    th: 'ยกเลิกใช้งาน',
    en: 'Obsolete',
    token: 'obsolete'
  },
  controlled: {
    th: 'สำเนาควบคุม',
    en: 'Controlled',
    token: 'controlled'
  }
};

// Attachment formats the register accepts.
const ATTACH_FORMATS = [{
  kind: 'pdf',
  th: 'PDF',
  note: 'สำหรับเปิดดู',
  use: 'view'
}, {
  kind: 'word',
  th: 'Word',
  note: 'สำหรับแก้ไข',
  use: 'edit'
}, {
  kind: 'url',
  th: 'URL',
  note: 'แนบ App / E-Doc',
  use: 'link'
}];

// Actions an authenticated user performs (audit-logged).
const QMS_ACTIONS = [{
  key: 'register',
  th: 'ลงทะเบียนเอกสาร',
  en: 'Register document'
}, {
  key: 'decommission',
  th: 'ยกเลิกการใช้งาน',
  en: 'Decommission'
}, {
  key: 'announce',
  th: 'บันทึกประกาศใช้',
  en: 'Record effective'
}, {
  key: 'revise',
  th: 'บันทึกแก้ไข',
  en: 'Record revision'
}, {
  key: 'acknowledge',
  th: 'บันทึกการอ่าน/รับทราบ',
  en: 'Acknowledge read'
}];

// A few sample register rows for screens & cards.
const SAMPLE_DOCS = [{
  no: 'QM-CMTL-001',
  th: 'คู่มือคุณภาพห้องปฏิบัติการ',
  type: 'QM',
  cat: 'CMTL',
  rev: 4,
  status: 'effective',
  updated: '2026-05-12',
  owner: 'พญ. สุรีย์พร ก.'
}, {
  no: 'SP-IMM-014',
  th: 'การควบคุมคุณภาพการตรวจภูมิคุ้มกัน',
  type: 'SP',
  cat: 'IMM',
  rev: 2,
  status: 'effective',
  updated: '2026-04-28',
  owner: 'ทนพ. ธนกร พ.'
}, {
  no: 'WI-MIC-022',
  th: 'การย้อมสีแกรมและการอ่านผล',
  type: 'WI',
  cat: 'MIC',
  rev: 1,
  status: 'review',
  updated: '2026-06-02',
  owner: 'ทนพญ. กมลชนก ส.'
}, {
  no: 'FM-OPD-103',
  th: 'แบบฟอร์มขอตรวจทางห้องปฏิบัติการ',
  type: 'FM',
  cat: 'OPD',
  rev: 6,
  status: 'effective',
  updated: '2026-03-15',
  owner: 'นางสาว วราภรณ์ ด.'
}, {
  no: 'WS-OUT-008',
  th: 'แบบบันทึกการส่งต่อสิ่งส่งตรวจ',
  type: 'WS',
  cat: 'OUT',
  rev: 3,
  status: 'draft',
  updated: '2026-06-10',
  owner: 'ทนพ. ปรัชญา ม.'
}, {
  no: 'ED-THAMC-045',
  th: 'ทะเบียนเครื่องมือและการสอบเทียบ',
  type: 'ED',
  cat: 'THAMC',
  rev: 2,
  status: 'controlled',
  updated: '2026-05-30',
  owner: 'ทนพญ. อรพิน จ.'
}, {
  no: 'SD-CMTL-031',
  th: 'เอกสารความปลอดภัยทางชีวภาพ',
  type: 'SD',
  cat: 'CMTL',
  rev: 1,
  status: 'obsolete',
  updated: '2025-12-01',
  owner: 'พญ. สุรีย์พร ก.'
}];
Object.assign(__ds_scope, { DOC_TYPES, WORK_CATEGORIES, DOC_STATUS, ATTACH_FORMATS, QMS_ACTIONS, SAMPLE_DOCS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "data/taxonomy.js", error: String((e && e.message) || e) }); }

// ui_kits/qms/AppShell.jsx
try { (() => {
/* AppShell — sidebar + topbar chrome wrapping every signed-in screen. */
function AppShell({
  view,
  onNav,
  cat,
  onCat,
  onLogout,
  user,
  title,
  subtitle,
  actions,
  children
}) {
  const DS = window.TUHLabQMSDesignSystem_f1744f;
  const {
    Avatar
  } = DS;
  const Q = window.QMS;
  const NavItem = ({
    id,
    icon,
    label,
    count
  }) => {
    const active = view === id;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => onNav(id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        width: '100%',
        textAlign: 'left',
        padding: '9px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--teal-50)' : 'transparent',
        color: active ? 'var(--teal-800)' : 'var(--text-secondary)',
        font: (active ? 'var(--fw-semibold) ' : 'var(--fw-medium) ') + 'var(--text-sm)/1 var(--font-body)',
        transition: 'background var(--dur-fast)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--slate-100)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 17,
      color: active ? 'var(--teal-700)' : 'var(--text-tertiary)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, label), count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--fw-semibold) var(--text-2xs)/1 var(--font-mono)',
        color: active ? 'var(--teal-700)' : 'var(--text-tertiary)'
      }
    }, count));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      background: 'var(--white)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: 'var(--brand-50)',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0,
      border: '1px solid var(--brand-100)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/lab-seal.png",
    alt: "\u0E15\u0E23\u0E32 \u0E23\u0E1E\u0E18.",
    style: {
      width: 32,
      height: 32,
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.25
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm)/1.2 var(--font-display)',
      color: 'var(--text-primary)'
    }
  }, "\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1.2 var(--font-mono)',
      color: 'var(--text-tertiary)',
      letterSpacing: '.02em'
    }
  }, "TUH \xB7 \u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      overflowY: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(NavItem, {
    id: "dashboard",
    icon: "LayoutDashboard",
    label: "\u0E41\u0E14\u0E0A\u0E1A\u0E2D\u0E23\u0E4C\u0E14"
  }), /*#__PURE__*/React.createElement(NavItem, {
    id: "register",
    icon: "FolderClosed",
    label: "\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23",
    count: Q.DOCS.length
  }), /*#__PURE__*/React.createElement(NavItem, {
    id: "acknowledge",
    icon: "BellRing",
    label: "\u0E23\u0E2D\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A",
    count: 3
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onCat('LAB'),
    title: "\u0E07\u0E32\u0E19\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      width: '100%',
      textAlign: 'left',
      padding: '9px 12px',
      marginTop: 6,
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      cursor: 'pointer',
      background: cat === 'LAB' && view === 'register' ? 'var(--brand-700)' : 'var(--brand-50)',
      color: cat === 'LAB' && view === 'register' ? '#fff' : 'var(--brand-700)',
      font: 'var(--fw-semibold) var(--text-sm)/1.2 var(--font-body)',
      transition: 'background var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FlaskConical",
    size: 17,
    color: cat === 'LAB' && view === 'register' ? '#fff' : 'var(--brand-600)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "\u0E07\u0E32\u0E19\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1 var(--font-body)',
      fontWeight: 600,
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      padding: '14px 12px 6px'
    }
  }, "\u0E2B\u0E21\u0E27\u0E14\u0E07\u0E32\u0E19"), Q.WORK_CATEGORIES.map(c => {
    const active = cat === c.code && view === 'register';
    return /*#__PURE__*/React.createElement("button", {
      key: c.code,
      onClick: () => onCat(c.code),
      title: c.th,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        textAlign: 'left',
        padding: '7px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--brand-50)' : 'transparent',
        color: active ? 'var(--brand-800)' : 'var(--text-secondary)',
        font: (active ? 'var(--fw-semibold) ' : 'var(--fw-regular) ') + 'var(--text-xs)/1.3 var(--font-body)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--slate-100)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--fw-bold) var(--text-2xs)/1 var(--font-mono)',
        color: 'var(--text-tertiary)',
        width: 38,
        flexShrink: 0
      }
    }, c.code), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, c.th));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: user.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      lineHeight: 1.3,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-xs)/1.2 var(--font-body)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1.2 var(--font-body)',
      color: 'var(--text-tertiary)'
    }
  }, user.role)), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    title: "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 6,
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "LogOut",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--topbar-height)',
      flexShrink: 0,
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 var(--page-gutter)',
      position: 'sticky',
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-bold) var(--text-lg)/1.1 var(--font-display)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1.2 var(--font-body)',
      color: 'var(--text-tertiary)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), actions), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: 'var(--page-gutter)',
      overflowY: 'auto'
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qms/DashboardScreen.jsx
try { (() => {
/* DashboardScreen — register overview: KPIs, type distribution, recent activity. */
function DashboardScreen({
  onOpen,
  onGoRegister
}) {
  const DS = window.TUHLabQMSDesignSystem_f1744f;
  const {
    Card,
    DocTypeTag,
    StatusBadge,
    Button
  } = DS;
  const Q = window.QMS;
  const total = Q.DOCS.length;
  const eff = Q.DOCS.filter(d => d.status === 'effective').length;
  const rev = Q.DOCS.filter(d => d.status === 'review').length;
  const pendingAck = Q.DOCS.filter(d => d.status === 'effective' && d.reads < d.total).length;
  const Kpi = ({
    icon,
    color,
    bg,
    value,
    label,
    delay
  }) => {
    const [hov, setHov] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        flex: 1,
        position: 'relative',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        overflow: 'hidden',
        boxShadow: hov ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hov ? 'translateY(-3px)' : 'none',
        transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: color,
        opacity: .85
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-md)',
        background: bg,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        transform: hov ? 'scale(1.06)' : 'none',
        transition: 'transform var(--dur-base) var(--ease-standard)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 21,
      color: color
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--fw-bold) var(--text-3xl)/1 var(--font-display)',
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em'
      }
    }, value), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-xs)/1.2 var(--font-body)',
        color: 'var(--text-tertiary)',
        marginTop: 3
      }
    }, label))));
  };

  // distribution by type
  const byType = Q.DOC_TYPES.map(t => ({
    ...t,
    n: Q.DOCS.filter(d => d.type === t.code).length
  })).filter(t => t.n > 0);
  const maxN = Math.max(...byType.map(t => t.n), 1);
  const recent = Q.DOCS.slice().sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 5);
  return /*#__PURE__*/React.createElement("div", {
    className: "qms-rise",
    style: {
      maxWidth: 'var(--container-max)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "qms-stagger",
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Kpi, {
    icon: "Files",
    color: "var(--brand-700)",
    bg: "var(--brand-50)",
    value: total,
    label: "\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"
  }), /*#__PURE__*/React.createElement(Kpi, {
    icon: "CircleCheck",
    color: "var(--green-700)",
    bg: "var(--green-100)",
    value: eff,
    label: "\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E43\u0E0A\u0E49"
  }), /*#__PURE__*/React.createElement(Kpi, {
    icon: "Clock",
    color: "var(--amber-700)",
    bg: "var(--amber-100)",
    value: rev,
    label: "\u0E23\u0E2D\u0E17\u0E1A\u0E17\u0E27\u0E19"
  }), /*#__PURE__*/React.createElement(Kpi, {
    icon: "BellRing",
    color: "var(--violet-700)",
    bg: "var(--violet-100)",
    value: pendingAck,
    label: "\u0E23\u0E2D\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    header: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E15\u0E32\u0E21\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, byType.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.code,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      font: 'var(--fw-bold) var(--text-2xs)/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, t.code), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--slate-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: t.n / maxN * 100 + '%',
      height: '100%',
      background: 'var(--teal-600)',
      borderRadius: 'var(--radius-pill)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      textAlign: 'right',
      font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-mono)',
      color: 'var(--text-primary)'
    }
  }, t.n))))), /*#__PURE__*/React.createElement(Card, {
    padding: "none",
    header: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", null, "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        onGoRegister();
      },
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-link)'
      }
    }, "\u0E14\u0E39\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"))
  }, /*#__PURE__*/React.createElement("div", null, recent.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.no,
    onClick: () => onOpen(d),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 18px',
      borderBottom: i === recent.length - 1 ? 'none' : '1px solid var(--border-subtle)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--slate-50)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement(DocTypeTag, {
    type: d.type
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-medium) var(--text-sm)/1.3 var(--font-body)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, d.th), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1.3 var(--font-mono)',
      color: 'var(--text-tertiary)'
    }
  }, d.no, " \xB7 ", d.updated)), /*#__PURE__*/React.createElement(StatusBadge, {
    status: d.status,
    size: "sm"
  })))))));
}
Object.assign(window, {
  DashboardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qms/DocDetailScreen.jsx
try { (() => {
/* DocDetailScreen — controlled-document view: header band, attachments,
   revision history, acknowledgement + workflow actions. */
function DocDetailScreen({
  doc,
  onBack,
  onAck
}) {
  const DS = window.TUHLabQMSDesignSystem_f1744f;
  const {
    Button,
    StatusBadge,
    DocTypeTag,
    Card,
    Alert,
    Checkbox,
    Avatar
  } = DS;
  const Q = window.QMS;
  const catObj = Q.WORK_CATEGORIES.find(c => c.code === doc.cat);
  const typeObj = Q.DOC_TYPES.find(t => t.code === doc.type);
  const [ack, setAck] = React.useState(doc.acked || false);
  const pct = Math.round(doc.reads / doc.total * 100);
  const narrow = window.useNarrow(900);
  const Field = ({
    k,
    v
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-2xs)/1 var(--font-body)',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-medium) var(--text-sm)/1.3 var(--font-body)',
      color: 'var(--text-primary)'
    }
  }, v));
  return /*#__PURE__*/React.createElement("div", {
    className: "qms-rise",
    style: {
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      font: 'var(--type-ui)',
      padding: 0,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ArrowLeft",
    size: 16
  }), " \u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23"), doc.status === 'review' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E09\u0E1A\u0E31\u0E1A\u0E19\u0E35\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E17\u0E1A\u0E17\u0E27\u0E19",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "AlertTriangle",
      size: 18,
      color: "var(--amber-700)"
    })
  }, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E43\u0E0A\u0E49\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E09\u0E1A\u0E31\u0E1A\u0E17\u0E35\u0E48\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E43\u0E0A\u0E49\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E08\u0E19\u0E01\u0E27\u0E48\u0E32\u0E01\u0E32\u0E23\u0E17\u0E1A\u0E17\u0E27\u0E19\u0E08\u0E30\u0E41\u0E25\u0E49\u0E27\u0E40\u0E2A\u0E23\u0E47\u0E08")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: narrow ? '1fr' : '1fr 320px',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '64px 1fr',
      borderBottom: '1.5px solid var(--brand-700)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--brand-50)',
      display: 'grid',
      placeItems: 'center',
      borderRight: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/lab-seal.png",
    alt: "\u0E15\u0E23\u0E32\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E18\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E40\u0E09\u0E25\u0E34\u0E21\u0E1E\u0E23\u0E30\u0E40\u0E01\u0E35\u0E22\u0E23\u0E15\u0E34",
    style: {
      width: 46,
      height: 46,
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(DocTypeTag, {
    type: doc.type
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    status: doc.status,
    size: "sm"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--fw-bold) var(--text-2xl)/1.2 var(--font-display)',
      color: 'var(--text-primary)',
      marginBottom: 4
    }
  }, doc.th), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-sm)/1.4 var(--font-body)',
      color: 'var(--text-secondary)'
    }
  }, typeObj.th, " \xB7 \u0E2B\u0E21\u0E27\u0E14\u0E07\u0E32\u0E19", catObj.th))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: narrow ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: 16,
      padding: '16px 18px',
      background: 'var(--slate-50)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    k: "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23",
    v: doc.no
  }), /*#__PURE__*/React.createElement(Field, {
    k: "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48",
    v: String(doc.rev).padStart(2, '0')
  }), /*#__PURE__*/React.createElement(Field, {
    k: "\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E43\u0E0A\u0E49",
    v: doc.updated
  }), /*#__PURE__*/React.createElement(Field, {
    k: "\u0E1C\u0E39\u0E49\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A",
    v: doc.owner
  }))), /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Paperclip",
      size: 16,
      color: "var(--text-secondary)"
    }), " \u0E44\u0E1F\u0E25\u0E4C\u0E41\u0E19\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, doc.files.map(f => {
    const m = window.FILE_META[f];
    return /*#__PURE__*/React.createElement("div", {
      key: f,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 'var(--radius-sm)',
        background: m.bg,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: m.icon,
      size: 19,
      color: m.c,
      sw: 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--fw-semibold) var(--text-base)/1.2 var(--font-body)',
        color: 'var(--text-primary)'
      }
    }, m.label, " \xB7 ", m.note), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-2xs)/1.3 var(--font-mono)',
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, f === 'url' ? 'https://edoc.tuh.go.th/' + doc.no.toLowerCase() : doc.no + (f === 'pdf' ? '.pdf' : '.docx'))), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: f === 'url' ? 'ExternalLink' : f === 'word' ? 'Pencil' : 'Eye',
        size: 15,
        color: "var(--teal-700)"
      })
    }, f === 'url' ? 'เปิดลิงก์' : f === 'word' ? 'แก้ไข' : 'เปิดดู'));
  }))), /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    header: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "History",
      size: 16,
      color: "var(--text-secondary)"
    }), " \u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, Q.REVISIONS.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.rev,
    style: {
      display: 'flex',
      gap: 14,
      paddingBottom: i === Q.REVISIONS.length - 1 ? 0 : 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: i === 0 ? 'var(--teal-700)' : 'var(--slate-100)',
      color: i === 0 ? '#fff' : 'var(--text-secondary)',
      display: 'grid',
      placeItems: 'center',
      font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)',
      flexShrink: 0
    }
  }, String(r.rev).padStart(2, '0')), i !== Q.REVISIONS.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1.5,
      flex: 1,
      background: 'var(--border-default)',
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-medium) var(--text-base)/1.3 var(--font-body)',
      color: 'var(--text-primary)'
    }
  }, r.note), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1.4 var(--font-mono)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, r.date, " \xB7 ", r.by))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'sticky',
      top: 'calc(var(--topbar-height) + 16px)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-body)',
      color: 'var(--text-secondary)',
      marginBottom: 12
    }
  }, "\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-display)',
      color: 'var(--teal-700)'
    }
  }, doc.reads), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-sm)/1 var(--font-body)',
      color: 'var(--text-tertiary)'
    }
  }, "/ ", doc.total, " \u0E04\u0E19"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 7,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--slate-100)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: 'var(--teal-600)',
      borderRadius: 'var(--radius-pill)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, ack ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--green-700)',
      font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CircleCheck",
    size: 18,
    color: "var(--green-600)"
  }), " \u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E41\u0E25\u0E49\u0E27") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "\u0E02\u0E49\u0E32\u0E1E\u0E40\u0E08\u0E49\u0E32\u0E44\u0E14\u0E49\u0E2D\u0E48\u0E32\u0E19\u0E41\u0E25\u0E30\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E09\u0E1A\u0E31\u0E1A\u0E19\u0E35\u0E49\u0E41\u0E25\u0E49\u0E27",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "sm",
    onClick: () => {
      setAck(true);
      onAck && onAck(doc);
    },
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "Check",
      size: 16,
      color: "#fff"
    })
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E17\u0E23\u0E32\u0E1A")))), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-body)',
      color: 'var(--text-secondary)',
      marginBottom: 12
    }
  }, "\u0E01\u0E32\u0E23\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "Megaphone",
      size: 15,
      color: "var(--teal-700)"
    })
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E43\u0E0A\u0E49"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "PencilLine",
      size: 15,
      color: "var(--teal-700)"
    })
  }, "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E01\u0E49\u0E44\u0E02"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "Download",
      size: 15,
      color: "var(--teal-700)"
    })
  }, "\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    block: true,
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "Ban",
      size: 15,
      color: "#fff"
    })
  }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"))))));
}
Object.assign(window, {
  DocDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/DocDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qms/LoginScreen.jsx
try { (() => {
/* Login — identity gate for the QMS. Modern split: green gradient brand panel
   with the hospital seal, glassy form card. */
function LoginScreen({
  onLogin
}) {
  const DS = window.TUHLabQMSDesignSystem_f1744f;
  const {
    Button,
    Input
  } = DS;
  const [user, setUser] = React.useState('thanakorn.p');
  const [pw, setPw] = React.useState('••••••••');
  const narrow = window.useNarrow(860);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: narrow ? '1fr' : '1.05fr 1fr',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: narrow ? 'none' : 'flex',
      position: 'relative',
      background: 'var(--grad-hero)',
      color: '#fff',
      padding: '56px 60px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-20%',
      right: '-10%',
      width: 460,
      height: 460,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(242,135,110,.34), transparent 62%)',
      filter: 'blur(8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '-25%',
      left: '-12%',
      width: 420,
      height: 420,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(94,108,214,.30), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
      backgroundSize: '46px 46px',
      maskImage: 'radial-gradient(120% 90% at 30% 20%, #000, transparent 75%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: '#fff',
      display: 'grid',
      placeItems: 'center',
      boxShadow: '0 8px 24px -6px rgba(0,0,0,.35)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/lab-seal.png",
    alt: "\u0E15\u0E23\u0E32\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E18\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E40\u0E09\u0E25\u0E34\u0E21\u0E1E\u0E23\u0E30\u0E40\u0E01\u0E35\u0E22\u0E23\u0E15\u0E34",
    style: {
      width: 52,
      height: 52,
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-medium) var(--text-base)/1.45 var(--font-body)',
      opacity: .95
    }
  }, "\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C", /*#__PURE__*/React.createElement("br", null), "\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E18\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E40\u0E09\u0E25\u0E34\u0E21\u0E1E\u0E23\u0E30\u0E40\u0E01\u0E35\u0E22\u0E23\u0E15\u0E34")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(255,255,255,.14)',
      border: '1px solid rgba(255,255,255,.22)',
      font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      marginBottom: 18,
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#F2876E'
    }
  }), " Lab Quality Document System"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--fw-bold) var(--text-4xl)/1.1 var(--font-display)',
      color: '#fff',
      marginBottom: 16,
      textWrap: 'balance',
      letterSpacing: '-0.01em'
    }
  }, "\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E", /*#__PURE__*/React.createElement("br", null), "\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--text-md)/1.7 var(--font-body)',
      color: 'rgba(255,255,255,.84)',
      maxWidth: 430
    }
  }, "\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E40\u0E01\u0E47\u0E1A \u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21 \u0E41\u0E25\u0E30\u0E40\u0E1C\u0E22\u0E41\u0E1E\u0E23\u0E48\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, ['9 ประเภทเอกสาร', 'ควบคุมเวอร์ชันอัตโนมัติ'].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      font: 'var(--text-xs)/1 var(--font-body)',
      color: 'rgba(255,255,255,.9)',
      padding: '7px 13px',
      borderRadius: 'var(--radius-pill)',
      background: 'rgba(255,255,255,.10)',
      border: '1px solid rgba(255,255,255,.16)'
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 384
    }
  }, narrow && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: '#fff',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/lab-seal.png",
    alt: "\u0E15\u0E23\u0E32 \u0E23\u0E1E\u0E18.",
    style: {
      width: 38,
      height: 38,
      objectFit: 'contain'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-semibold) var(--text-sm)/1.35 var(--font-display)',
      color: 'var(--text-primary)'
    }
  }, "\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E2B\u0E49\u0E2D\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-2xs)/1.3 var(--font-mono)',
      color: 'var(--text-tertiary)'
    }
  }, "\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E18\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E40\u0E09\u0E25\u0E34\u0E21\u0E1E\u0E23\u0E30\u0E40\u0E01\u0E35\u0E22\u0E23\u0E15\u0E34"))), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-page-title)',
      marginBottom: 6
    }
  }, "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      marginBottom: 28
    }
  }, "\u0E23\u0E30\u0E1A\u0E38\u0E15\u0E31\u0E27\u0E15\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E01\u0E31\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onLogin();
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19",
    value: user,
    onChange: e => setUser(e.target.value),
    prefix: /*#__PURE__*/React.createElement(Icon, {
      name: "User",
      size: 16,
      color: "var(--text-tertiary)"
    })
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19",
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    prefix: /*#__PURE__*/React.createElement(Icon, {
      name: "Lock",
      size: 16,
      color: "var(--text-tertiary)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      font: 'var(--type-caption)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: true,
    style: {
      accentColor: 'var(--brand-700)'
    }
  }), " \u0E08\u0E14\u0E08\u0E33\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-link)'
    }
  }, "\u0E25\u0E37\u0E21\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19?")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    block: true,
    size: "lg",
    style: {
      boxShadow: 'var(--glow-brand)'
    },
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "ArrowRight",
      size: 18,
      color: "#fff"
    })
  }, "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      marginTop: 22,
      textAlign: 'center'
    }
  }, "\u0E43\u0E0A\u0E49\u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E32\u0E23\u0E2A\u0E19\u0E40\u0E17\u0E28\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25 (HIS)"))));
}
Object.assign(window, {
  LoginScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qms/RegisterScreen.jsx
try { (() => {
/* RegisterScreen — the document register table with type / status / search filters. */
function RegisterScreen({
  cat,
  onOpen
}) {
  const DS = window.TUHLabQMSDesignSystem_f1744f;
  const {
    DocTypeTag,
    StatusBadge,
    IconButton,
    Tabs,
    Input
  } = DS;
  const Q = window.QMS;
  const [type, setType] = React.useState('all');
  const [tab, setTab] = React.useState('all');
  const [q, setQ] = React.useState('');
  const LAB = {
    code: 'LAB',
    th: 'งานห้องปฏิบัติการเทคนิคการแพทย์'
  };
  const isLab = cat === 'LAB';
  const catObj = isLab ? LAB : Q.WORK_CATEGORIES.find(c => c.code === cat);
  let rows = Q.DOCS.slice();
  if (cat && !isLab) rows = rows.filter(d => d.cat === cat);
  if (type !== 'all') rows = rows.filter(d => d.type === type);
  if (tab !== 'all') rows = rows.filter(d => d.status === tab);
  if (q.trim()) rows = rows.filter(d => (d.no + d.th).toLowerCase().includes(q.trim().toLowerCase()));
  const base = cat && !isLab ? Q.DOCS.filter(d => d.cat === cat) : Q.DOCS;
  const count = s => base.filter(d => d.status === s).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "qms-rise",
    style: {
      maxWidth: 'var(--container-max)'
    }
  }, catObj && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)',
      color: '#fff',
      background: 'var(--brand-700)',
      padding: '4px 8px',
      borderRadius: 'var(--radius-sm)'
    }
  }, catObj.code), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-section)',
      color: 'var(--text-primary)'
    }
  }, catObj.th)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      flexWrap: 'wrap',
      marginBottom: 16
    }
  }, [{
    code: 'all',
    th: 'ทุกประเภท'
  }].concat(Q.DOC_TYPES).map(t => {
    const active = type === t.code;
    return /*#__PURE__*/React.createElement("button", {
      key: t.code,
      onClick: () => setType(t.code),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 11px',
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        border: '1px solid ' + (active ? 'var(--teal-700)' : 'var(--border-default)'),
        background: active ? 'var(--teal-700)' : 'var(--white)',
        color: active ? '#fff' : 'var(--text-secondary)',
        font: 'var(--fw-medium) var(--text-xs)/1 var(--font-body)'
      }
    }, t.code !== 'all' && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--fw-bold) var(--text-2xs)/1 var(--font-mono)',
        opacity: active ? 1 : .8
      }
    }, t.code), t.th);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      value: 'all',
      label: 'ทั้งหมด',
      count: base.length
    }, {
      value: 'effective',
      label: 'ประกาศใช้',
      count: count('effective')
    }, {
      value: 'review',
      label: 'รอทบทวน',
      count: count('review')
    }, {
      value: 'draft',
      label: 'ร่าง',
      count: count('draft')
    }, {
      value: 'obsolete',
      label: 'ยกเลิก',
      count: count('obsolete')
    }],
    style: {
      flex: 1,
      minWidth: 280
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48/\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23",
    value: q,
    onChange: e => setQ(e.target.value),
    prefix: /*#__PURE__*/React.createElement(Icon, {
      name: "Search",
      size: 15,
      color: "var(--text-tertiary)"
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--white)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      minWidth: 820,
      borderCollapse: 'collapse',
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("colgroup", null, /*#__PURE__*/React.createElement("col", {
    style: {
      width: 132
    }
  }), /*#__PURE__*/React.createElement("col", null), /*#__PURE__*/React.createElement("col", {
    style: {
      width: 96
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: 150
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: 116
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: 124
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: 52
    }
  })), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--slate-50)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, ['เลขที่เอกสาร', 'ชื่อเอกสาร', 'แก้ไขครั้งที่', 'ไฟล์แนบ', 'สถานะ', 'ปรับปรุงล่าสุด', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: i === 2 ? 'center' : 'left',
      padding: '11px 16px',
      font: 'var(--fw-semibold) var(--text-2xs)/1 var(--font-body)',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      whiteSpace: 'nowrap'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((d, idx) => /*#__PURE__*/React.createElement("tr", {
    key: d.no,
    onClick: () => onOpen(d),
    style: {
      borderBottom: idx === rows.length - 1 ? 'none' : '1px solid var(--border-subtle)',
      cursor: 'pointer',
      transition: 'background var(--dur-fast)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--slate-50)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement(DocTypeTag, {
    type: d.type
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-medium) var(--text-base)/1.35 var(--font-body)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    }
  }, d.th), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-2xs)/1.3 var(--font-mono)',
      color: 'var(--text-tertiary)',
      marginTop: 3,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, d.no, " \xB7 ", d.owner)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      textAlign: 'center',
      font: 'var(--fw-medium) var(--text-sm)/1 var(--font-mono)',
      color: 'var(--text-secondary)'
    }
  }, String(d.rev).padStart(2, '0')), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, d.files.map(f => /*#__PURE__*/React.createElement(FileChip, {
    key: f,
    kind: f,
    size: "sm"
  })))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: d.status,
    size: "sm"
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      font: 'var(--text-sm)/1 var(--font-mono)',
      color: 'var(--text-tertiary)',
      whiteSpace: 'nowrap'
    }
  }, d.updated), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 12px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "\u0E40\u0E1B\u0E34\u0E14\u0E14\u0E39\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronRight",
    size: 18,
    color: "var(--text-tertiary)"
  })))))))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 16px',
      textAlign: 'center',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "FileSearch",
    size: 28,
    color: "var(--slate-300)",
    style: {
      margin: '0 auto 10px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)'
    }
  }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E15\u0E32\u0E21\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01"))));
}
Object.assign(window, {
  RegisterScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/RegisterScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qms/data.js
try { (() => {
/* TUH Lab QMS — UI-kit data (browser global, no modules).
   Mirrors /data/taxonomy.js for the click-through recreation. */
window.QMS = function () {
  const DOC_TYPES = [{
    code: 'QM',
    th: 'คู่มือคุณภาพ',
    en: 'Quality Manual'
  }, {
    code: 'SP',
    th: 'ระเบียบปฏิบัติ',
    en: 'Standard Procedure'
  }, {
    code: 'WI',
    th: 'วิธีปฏิบัติ',
    en: 'Work Instruction'
  }, {
    code: 'WS',
    th: 'แบบบันทึกการปฏิบัติงาน',
    en: 'Work Sheet'
  }, {
    code: 'FM',
    th: 'แบบฟอร์มบันทึก',
    en: 'Form Sheet'
  }, {
    code: 'EF',
    th: 'บันทึกอิเล็กทรอนิกส์',
    en: 'Electronic Form'
  }, {
    code: 'ED',
    th: 'เอกสารอิเล็กทรอนิกส์',
    en: 'Electronic Document'
  }, {
    code: 'SD',
    th: 'เอกสารสนับสนุน',
    en: 'Supporting Document'
  }, {
    code: 'RF',
    th: 'เอกสารอ้างอิง',
    en: 'References'
  }];
  const WORK_CATEGORIES = [{
    code: 'OUT',
    th: 'รับสิ่งส่งตรวจและห้องปฏิบัติการส่งต่อ',
    en: 'Specimen Receiving & Referral'
  }, {
    code: 'HEM',
    th: 'โลหิตวิทยา',
    en: 'Hematology'
  }, {
    code: 'MIC',
    th: 'จุลทรรศนศาสตร์และปรสิตวิทยา',
    en: 'Microscopy & Parasitology'
  }, {
    code: 'CHE',
    th: 'เคมีคลินิก',
    en: 'Clinical Chemistry'
  }, {
    code: 'IMM',
    th: 'ภูมิคุ้มกันวิทยา',
    en: 'Immunology'
  }, {
    code: 'OPD',
    th: 'บริหารสิ่งส่งตรวจและบริการผู้ป่วยนอก รพธ.',
    en: 'Specimen Admin & OPD'
  }, {
    code: 'THAMC',
    th: 'บริหารจัดการสิ่งส่งตรวจและบริการศูนย์การแพทย์',
    en: 'Specimen Mgmt & Medical Centre'
  }, {
    code: 'POC',
    th: 'บริหารจัดการเครื่องมือ ณ จุดดูแลผู้ป่วย',
    en: 'Point-of-Care Testing'
  }, {
    code: 'CMTL',
    th: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    en: 'Medical Diagnostic Centre'
  }, {
    code: 'ADS',
    th: 'ธุรการและคลังพัสดุห้องปฏิบัติการ',
    en: 'Administration & Lab Supplies'
  }, {
    code: 'DIL',
    th: 'เวชสารสนเทศห้องปฏิบัติการ',
    en: 'Laboratory Medical Informatics'
  }];
  const STATUS = {
    draft: {
      th: 'ร่าง'
    },
    review: {
      th: 'รอทบทวน'
    },
    approved: {
      th: 'อนุมัติแล้ว'
    },
    effective: {
      th: 'ประกาศใช้'
    },
    obsolete: {
      th: 'ยกเลิกใช้งาน'
    },
    controlled: {
      th: 'สำเนาควบคุม'
    }
  };
  const DOCS = [{
    no: 'QM-CMTL-001',
    th: 'คู่มือคุณภาพห้องปฏิบัติการ',
    type: 'QM',
    cat: 'CMTL',
    rev: 4,
    status: 'effective',
    updated: '2026-05-12',
    owner: 'พญ. สุรีย์พร กิตติ',
    files: ['pdf', 'word'],
    reads: 142,
    total: 156
  }, {
    no: 'SP-IMM-014',
    th: 'การควบคุมคุณภาพการตรวจภูมิคุ้มกัน',
    type: 'SP',
    cat: 'IMM',
    rev: 2,
    status: 'effective',
    updated: '2026-04-28',
    owner: 'ทนพ. ธนกร พงษ์',
    files: ['pdf', 'word'],
    reads: 38,
    total: 41
  }, {
    no: 'WI-MIC-022',
    th: 'การย้อมสีแกรมและการอ่านผล',
    type: 'WI',
    cat: 'MIC',
    rev: 1,
    status: 'review',
    updated: '2026-06-02',
    owner: 'ทนพญ. กมลชนก ส.',
    files: ['pdf', 'word', 'url'],
    reads: 0,
    total: 27
  }, {
    no: 'FM-OPD-103',
    th: 'แบบฟอร์มขอตรวจทางห้องปฏิบัติการ',
    type: 'FM',
    cat: 'OPD',
    rev: 6,
    status: 'effective',
    updated: '2026-03-15',
    owner: 'นางสาว วราภรณ์ ด.',
    files: ['pdf'],
    reads: 201,
    total: 210
  }, {
    no: 'WS-OUT-008',
    th: 'แบบบันทึกการส่งต่อสิ่งส่งตรวจ',
    type: 'WS',
    cat: 'OUT',
    rev: 3,
    status: 'draft',
    updated: '2026-06-10',
    owner: 'ทนพ. ปรัชญา ม.',
    files: ['word'],
    reads: 0,
    total: 19
  }, {
    no: 'ED-THAMC-045',
    th: 'ทะเบียนเครื่องมือและการสอบเทียบ',
    type: 'ED',
    cat: 'THAMC',
    rev: 2,
    status: 'controlled',
    updated: '2026-05-30',
    owner: 'ทนพญ. อรพิน จ.',
    files: ['pdf', 'url'],
    reads: 33,
    total: 35
  }, {
    no: 'SP-CHE-009',
    th: 'การควบคุมคุณภาพการตรวจเคมีคลินิก',
    type: 'SP',
    cat: 'CHE',
    rev: 5,
    status: 'effective',
    updated: '2026-05-08',
    owner: 'ทนพ. ณัฐพล ว.',
    files: ['pdf', 'word'],
    reads: 47,
    total: 52
  }, {
    no: 'WI-HEM-031',
    th: 'การตรวจนับเม็ดเลือดด้วยเครื่องอัตโนมัติ',
    type: 'WI',
    cat: 'HEM',
    rev: 2,
    status: 'effective',
    updated: '2026-04-19',
    owner: 'ทนพญ. ศิริพร ท.',
    files: ['pdf', 'word'],
    reads: 44,
    total: 48
  }, {
    no: 'EF-POC-002',
    th: 'บันทึกผลควบคุมคุณภาพเครื่องตรวจน้ำตาลปลายนิ้ว',
    type: 'EF',
    cat: 'POC',
    rev: 1,
    status: 'effective',
    updated: '2026-06-01',
    owner: 'ทนพ. อดิเทพ ค.',
    files: ['url'],
    reads: 12,
    total: 30
  }, {
    no: 'SD-CMTL-031',
    th: 'เอกสารความปลอดภัยทางชีวภาพ',
    type: 'SD',
    cat: 'CMTL',
    rev: 1,
    status: 'obsolete',
    updated: '2025-12-01',
    owner: 'พญ. สุรีย์พร กิตติ',
    files: ['pdf'],
    reads: 156,
    total: 156
  }, {
    no: 'RF-IMM-005',
    th: 'แนวทาง CLSI สำหรับการตรวจภูมิคุ้มกัน',
    type: 'RF',
    cat: 'IMM',
    rev: 1,
    status: 'effective',
    updated: '2026-02-14',
    owner: 'พญ. สุรีย์พร กิตติ',
    files: ['pdf', 'url'],
    reads: 22,
    total: 41
  }, {
    no: 'WI-CHE-018',
    th: 'การสอบเทียบปิเปตอัตโนมัติ',
    type: 'WI',
    cat: 'CHE',
    rev: 3,
    status: 'approved',
    updated: '2026-06-05',
    owner: 'ทนพ. ณัฐพล ว.',
    files: ['pdf', 'word'],
    reads: 0,
    total: 52
  }];
  const REVISIONS = [{
    rev: 4,
    date: '2026-05-12',
    by: 'พญ. สุรีย์พร กิตติ',
    note: 'ปรับปรุงขอบเขตให้ครอบคลุมหมวดงาน POCT'
  }, {
    rev: 3,
    date: '2025-11-20',
    by: 'พญ. สุรีย์พร กิตติ',
    note: 'แก้ไขผังโครงสร้างองค์กรห้องปฏิบัติการ'
  }, {
    rev: 2,
    date: '2025-04-03',
    by: 'ทนพ. ธนกร พงษ์',
    note: 'เพิ่มนโยบายความเป็นกลางและความลับ'
  }, {
    rev: 1,
    date: '2024-09-01',
    by: 'พญ. สุรีย์พร กิตติ',
    note: 'ประกาศใช้ครั้งแรก'
  }];
  return {
    DOC_TYPES,
    WORK_CATEGORIES,
    STATUS,
    DOCS,
    REVISIONS
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/data.js", error: String((e && e.message) || e) }); }

// ui_kits/qms/ui.jsx
try { (() => {
/* Shared UI helpers for the QMS kit — Lucide icon renderer + status maps. */

function Icon({
  name,
  size = 18,
  color = 'currentColor',
  sw = 2,
  style
}) {
  const lib = window.lucide && window.lucide.icons || {};
  const node = lib[name];
  if (!node) return React.createElement('span', {
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      ...style
    }
  });
  const children = node[2] || [];
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    }
  }, children.map((c, i) => React.createElement(c[0], {
    key: i,
    ...c[1]
  })));
}

// File-format chip meta (PDF view / Word edit / URL link).
const FILE_META = {
  pdf: {
    label: 'PDF',
    icon: 'FileText',
    note: 'เปิดดู',
    c: 'var(--red-600)',
    bg: 'var(--red-100)'
  },
  word: {
    label: 'Word',
    icon: 'FilePen',
    note: 'แก้ไข',
    c: 'var(--blue-700)',
    bg: 'var(--blue-100)'
  },
  url: {
    label: 'URL',
    icon: 'Link',
    note: 'แนบลิงก์',
    c: 'var(--violet-700)',
    bg: 'var(--violet-100)'
  }
};
function FileChip({
  kind,
  size = 'md'
}) {
  const m = FILE_META[kind];
  if (!m) return null;
  const pad = size === 'sm' ? '3px 8px' : '5px 10px';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      borderRadius: 'var(--radius-sm)',
      background: m.bg,
      color: m.c,
      font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: size === 'sm' ? 13 : 15,
    color: m.c,
    sw: 2.2
  }), m.label);
}
Object.assign(window, {
  Icon,
  FileChip,
  FILE_META
});

// Responsive helper — true when viewport is narrower than `bp`.
function useNarrow(bp) {
  const [n, setN] = React.useState(typeof window !== 'undefined' && window.innerWidth < bp);
  React.useEffect(() => {
    const h = () => setN(window.innerWidth < bp);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [bp]);
  return n;
}
Object.assign(window, {
  useNarrow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qms/ui.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.DocTypeTag = __ds_scope.DocTypeTag;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.DOC_TYPES = __ds_scope.DOC_TYPES;

__ds_ns.WORK_CATEGORIES = __ds_scope.WORK_CATEGORIES;

__ds_ns.DOC_STATUS = __ds_scope.DOC_STATUS;

__ds_ns.ATTACH_FORMATS = __ds_scope.ATTACH_FORMATS;

__ds_ns.QMS_ACTIONS = __ds_scope.QMS_ACTIONS;

__ds_ns.SAMPLE_DOCS = __ds_scope.SAMPLE_DOCS;

})();
