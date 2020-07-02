<template>
  <div :class="size" class="item_form">
    <div :class="{'opt_open': isOpen}" class="opt_comm opt_select">
      <strong class="screen_out">셀렉트</strong>
      <a
        :aria-expanded="isOpen"
        :class="{'error': isError, 'disabled': isDisabled}"
        @click="toggle"
        class="link_selected"
        href="javascript:;">
        <span>{{value}}</span>
        {{ hasPlaceholder }}
      </a>
      <input :id="id" :value="value" type="hidden" />
      <div class="box_opt">
        <em class="screen_out">선택지들</em>
        <ul class="list_opt">
          <li :class="{'on': item[valueKey] === value}" :key="idx" v-for="(item, idx) in options">
            <a
              :data-idx="idx"
              :id="`${id}${idx}`"
              @click="select(item)"
              href="javascript:;">
            <span class="inner_opt">
              <span class="txt_opt">
                {{ item[labelKey] }}
              </span>
            </span>
            </a>
          </li>
          <li v-if="options.length < 1"><em class="txt_empty">비어있음</em></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const SELECT_SIZE = {
  X_SMALL: 'form_xsmall',
  SMALL: 'form_small',
  MEDIUM: 'form_medium',
  FULL: ''
};
export default {
  name: 'DkSelect',
  data: function() {
    return {
      newObject: {},
      newLabel: '',
      isOpen: false
    }
  },
  props: {
    /**
     * 값 (모델 바인딩)
     * @prop {String, Number, Object, Array} value
     * @default null
     */
    value: {
      type: [String, Number, Object, Array],
      default: ''
    },
    /**
     * disabled 속성 바인딩
     * @prop {String, Boolean} disabled
     * @default false
     */
    disabled: {
      type: [String, Boolean],
      default: false
    },
    /**
     * placeholder 속성 바인딩
     * @prop {String} placeholder
     * @default I18N.LABEL.SELECT
     */
    placeholder: {
      type: String,
      default: '선택해주세여'
    },
    /**
     * 옵션 목록 바인딩
     * @prop {Array} options
     * @default []
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * label 컬럼 값
     * @prop {String} labelKey
     * @default 'title'
     */
    labelKey: {
      type: String,
      default: 'title'
    },
    /**
     * value 컬럼 값
     * @prop {String} valueKey
     * @default 'value'
     */
    valueKey: {
      type: String,
      default: 'value'
    },
    /**
     * 유효성 오류 여부
     * @prop {Boolean} isError
     * @default false
     */
    isError: {
      type: Boolean,
      default: false
    },
    /**
     * 오류 메시지
     * @prop {String} txtError
     * @default ''
     */
    txtError: {
      type: String,
      default: ''
    },
    /**
     * 레이블 텍스트
     * @prop {String} label
     * @default ''
     */
    label: {
      type: String,
      default: '셀렉트'
    },
    /**
     * value 바인딩시 오브젝트로 받을 지 여부
     * valueKey 또는 Object 전체 중 선택
     * @prop {Boolean} isObjectValue
     * @default false
     */
    isObjectValue: {
      type: Boolean,
      default: false
    },
    /**
     * 서브 메시지
     * (단, 에러 메시지가 있는 경우, 에러 메시지가 먼저 노출)
     * @prop {String} txtSub
     * @default ''
     */
    txtSub: {
      type: String,
      default: ''
    },
    /**
     * 크기 옵션
     * @prop {String} size
     * @default SELECT_SIZE.FULL
     */
    size: {
      type: String,
      default: SELECT_SIZE.FULL,
      validator: value => Object.keys(SELECT_SIZE).find(key => SELECT_SIZE[key] === value)
    },
    // isOpen: {
    //   type: Boolean,
    //   default: false
    // }
  },
  computed: {
    hasPlaceholder () {
      if (this.newLabel !== '') return this.newLabel;
      return this.placeholder
    }
  },
  watch: {
     value: {
      immediate: true,
      handler (value) {
        this.newValue = value;
        if (!this.isObjectValue) {
          const filter = this.options.filter((item) => {
            return item[this.valueKey] === value;
          })[0];
          if (filter) {
            this.newLabel = filter[this.labelKey];
            this.newObject = filter;
          }
        } else {
          const filter = this.options.filter((item) => {
            return item[this.valueKey] === value[this.valueKey];
          })[0];
          if (filter) {
            this.newLabel = filter[this.labelKey];
            this.newObject = filter;
          }
        }
        this.$emit('onChange', value);
      }
    },
  },
  methods: {
    toggle () {
      if (this.isDisabled) return false;
      this.isOpen = !this.isOpen;
      // this.$emit('update:isOpen',!this.isOpen);
    },
    select (item) {
      // this.$emit('update:isOpen', false);
      this.isOpen = false;
      // this.newLabel = item[this.labelKey];
      this.$emit('input', this.isObjectValue ? item : item[this.valueKey]);
    },
    spread (e) {
      this.isOpen = false;
      // this.$emit('update:isOpen', false);
      e.preventDefault();
    },
    fold () {
      this.isOpen = true;
      // this.$emit('update:isOpen', true);
    },
    first (e) {
      if (this.isOpen === false) this.fold();
      this.up(e);
    },
    up (e) {
      // console.log(e.target.dataset.idx)
      if (!e) {
        document.getElementById(this.id + '0').focus();
      } else {
        const idx = parseInt(e.target.dataset.idx);
        if (idx > 0) {
          document.getElementById(this.id + (idx - 1)).focus();
        } else {
          document.getElementById(this.id + (this.options.length - 1)).focus();
        }
      }
      e.preventDefault();
    },
    down (e) {
      // console.log(e.target.dataset.idx)
      if (!e) {
        document.getElementById(this.id + '0').focus();
      } else {
        const idx = parseInt(e.target.dataset.idx);
        if (this.options.length > idx + 1) {
          document.getElementById(this.id + (idx + 1)).focus();
        } else {
          document.getElementById(this.id + '0').focus();
        }
      }
      e.preventDefault();
    }
  }
}
</script>