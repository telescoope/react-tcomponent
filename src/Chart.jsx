import React, { useState, useEffect } from 'react'
import ApexCharts from 'react-apexcharts'

import { slug } from 'tcomponent'

import {
  isUndefined,
  isArray,
  isPlainObject,
  isString,
  isNumber,
  isBoolean,
  isNull,
  isEmpty
} from 'lodash'

function Chart(props) {
  let options = { chart: { width: 'auto' } }

  let series = props.series || []

  if (
    (isUndefined(props.series) ||
      isNull(props.series) ||
      !isArray(props.series)) &&
    isArray(props.options) &&
    !isUndefined(props.optionValue) &&
    !isNull(props.optionValue)
  ) {
    for (var i = 0; i < props.options.length; i++) {
      if (isString(props.optionValue)) {
        series.push(props.options[i][props.optionValue])
      } else if (isPlainObject(props.optionValue)) {
        let isi = {}
        Object.keys(props.optionValue).map((key, index) => {
          isi[props.optionValue[key]] = props.options[i][key]
        })
        series.push(isi)
      } else if (isArray(props.optionValue)) {
        let isi = []
        for (var i2 = 0; i2 < props.optionValue.length; i2++) {
          isi.push(props.options[i][props.optionValue[i2]])
        }
        series.push(isi)
      }
    }
  }

  if (
    !isUndefined(props.dataLabels) &&
    !isNull(props.dataLabels) &&
    isPlainObject(props.dataLabels)
  ) {
    options.dataLabels = props.dataLabels
  }

  let separator = ' '

  if (
    !isUndefined(props.separator) &&
    !isNull(props.separator) &&
    isPlainObject(props.separator)
  ) {
    separator = props.separator
  }

  if (
    !isUndefined(props.labels) &&
    !isNull(props.labels) &&
    isArray(props.labels)
  ) {
    options.labels = props.labels
  } else if (
    isArray(props.options) &&
    !isUndefined(props.optionLabel) &&
    !isNull(props.optionLabel)
  ) {
    options.labels = []

    for (var i = 0; i < props.options.length; i++) {
      if (isString(props.optionLabel)) {
        options.labels.push(props.options[i][props.optionLabel])
      } else if (isArray(props.optionLabel)) {
        let isi = []
        for (var i2 = 0; i2 < props.optionLabel.length; i2++) {
          isi.push(props.options[i][props.optionLabel[i2]])
        }
        options.labels.push(isi.join(separator))
      }
    }
  }

  if (
    !isUndefined(props.colors) &&
    !isNull(props.colors) &&
    isArray(props.colors)
  ) {
    options.colors = props.colors
  } else if (
    isArray(props.options) &&
    !isUndefined(props.optionColor) &&
    !isNull(props.optionColor) &&
    isString(props.optionColor)
  ) {
    options.colors = []

    for (var i = 0; i < props.options.length; i++) {
      options.colors.push(props.options[i][props.optionColor])
    }
  }

  if (
    !isUndefined(props.locales) &&
    !isNull(props.locales) &&
    isArray(props.locales)
  ) {
    options.chart.locales = props.locales
  }

  if (!isUndefined(props.type) && !isNull(props.type) && isString(props.type)) {
    options.chart.type = props.type
  }

  if (
    !isUndefined(props.animations) &&
    !isNull(props.animations) &&
    isPlainObject(props.animations)
  ) {
    options.chart.animations = props.animations
  }

  if (
    !isUndefined(props.background) &&
    !isNull(props.background) &&
    isString(props.background)
  ) {
    options.chart.background = props.background
  }

  if (
    !isUndefined(props.brush) &&
    !isNull(props.brush) &&
    isPlainObject(props.brush)
  ) {
    options.chart.brush = props.brush
  }

  if (
    !isUndefined(props.defaultLocale) &&
    !isNull(props.defaultLocale) &&
    isString(props.defaultLocale)
  ) {
    options.chart.defaultLocale = props.defaultLocale
  }

  if (
    !isUndefined(props.dropShadow) &&
    !isNull(props.dropShadow) &&
    isPlainObject(props.defaultLocale)
  ) {
    options.chart.dropShadow = props.dropShadow
  }

  if (
    !isUndefined(props.fontFamily) &&
    !isNull(props.fontFamily) &&
    isString(props.fontFamily)
  ) {
    options.chart.fontFamily = props.fontFamily
  }

  if (
    !isUndefined(props.foreColor) &&
    !isNull(props.foreColor) &&
    isString(props.foreColor)
  ) {
    options.chart.foreColor = props.foreColor
  }

  if (
    !isUndefined(props.group) &&
    !isNull(props.group) &&
    isString(props.group)
  ) {
    options.chart.group = props.group
  }

  if (
    !isUndefined(props.events) &&
    !isNull(props.events) &&
    isPlainObject(props.events)
  ) {
    options.chart.events = props.events
  }

  if (
    !isUndefined(props.height) &&
    !isNull(props.height) &&
    (isString(props.height) || isNumber(props.height))
  ) {
    options.chart.height = props.height
  }

  if (!isUndefined(props.id) && !isNull(props.id) && isString(props.id)) {
    options.chart.id = slug(props.id)
  }

  if (!isUndefined(props.name) && !isNull(props.name) && isString(props.name)) {
    options.chart.id = slug(props.name)
  }

  if (
    !isUndefined(props.offsetX) &&
    !isNull(props.offsetX) &&
    isNumber(props.offsetX)
  ) {
    options.chart.offsetX = props.offsetX
  }

  if (
    !isUndefined(props.offsetY) &&
    !isNull(props.offsetY) &&
    isNumber(props.offsetY)
  ) {
    options.chart.offsetY = props.offsetY
  }

  if (
    !isUndefined(props.parentHeightOffset) &&
    !isNull(props.parentHeightOffset) &&
    isNumber(props.parentHeightOffset)
  ) {
    options.chart.parentHeightOffset = props.parentHeightOffset
  }

  if (
    !isUndefined(props.redrawOnParentResize) &&
    !isNull(props.redrawOnParentResize) &&
    isBoolean(props.redrawOnParentResize)
  ) {
    options.chart.redrawOnParentResize = props.redrawOnParentResize
  }

  if (
    !isUndefined(props.redrawOnWindowResize) &&
    !isNull(props.redrawOnWindowResize) &&
    isBoolean(props.redrawOnWindowResize)
  ) {
    options.chart.redrawOnWindowResize = props.redrawOnWindowResize
  }

  if (
    !isUndefined(props.selection) &&
    !isNull(props.selection) &&
    isPlainObject(props.selection)
  ) {
    options.chart.selection = props.selection
  }

  if (
    !isUndefined(props.sparkline) &&
    !isNull(props.sparkline) &&
    isBoolean(props.sparkline)
  ) {
    options.chart.sparkline = props.sparkline
  }

  if (
    !isUndefined(props.stacked) &&
    !isNull(props.stacked) &&
    isBoolean(props.stacked)
  ) {
    options.chart.stacked = props.stacked
  }

  if (
    !isUndefined(props.stackType) &&
    !isNull(props.stackType) &&
    isString(props.stackType)
  ) {
    options.chart.stackType = props.stackType
  }

  if (
    !isUndefined(props.toolbar) &&
    !isNull(props.toolbar) &&
    isPlainObject(props.toolbar)
  ) {
    options.chart.toolbar = props.toolbar
  }

  if (
    !isUndefined(props.width) &&
    !isNull(props.width) &&
    (isString(props.width) || isNumber(props.width))
  ) {
    options.chart.width = props.width
  }

  if (
    !isUndefined(props.zoom) &&
    !isNull(props.zoom) &&
    isPlainObject(props.zoom)
  ) {
    options.chart.zoom = props.zoom
  }

  if (
    !isUndefined(props.fill) &&
    !isNull(props.fill) &&
    isPlainObject(props.fill)
  ) {
    options.fill = props.fill
  }

  if (
    !isUndefined(props.forecastDataPoints) &&
    !isNull(props.forecastDataPoints) &&
    isPlainObject(props.forecastDataPoints)
  ) {
    options.forecastDataPoints = props.forecastDataPoints
  }

  if (
    !isUndefined(props.grid) &&
    !isNull(props.grid) &&
    isPlainObject(props.grid)
  ) {
    options.grid = props.grid
  }

  if (
    !isUndefined(props.legend) &&
    !isNull(props.legend) &&
    isPlainObject(props.legend)
  ) {
    options.legend = props.legend
  }

  if (
    !isUndefined(props.markers) &&
    !isNull(props.markers) &&
    isPlainObject(props.markers)
  ) {
    options.markers = props.markers
  }

  if (
    !isUndefined(props.noData) &&
    !isNull(props.noData) &&
    isPlainObject(props.noData)
  ) {
    options.noData = props.noData
  }

  if (
    !isUndefined(props.states) &&
    !isNull(props.states) &&
    isPlainObject(props.states)
  ) {
    options.states = props.states
  }

  if (
    !isUndefined(props.stroke) &&
    !isNull(props.stroke) &&
    isPlainObject(props.stroke)
  ) {
    options.stroke = props.stroke
  }

  if (
    !isUndefined(props.subtitle) &&
    !isNull(props.subtitle) &&
    isPlainObject(props.subtitle)
  ) {
    options.subtitle = props.subtitle
  }

  if (
    !isUndefined(props.theme) &&
    !isNull(props.theme) &&
    isPlainObject(props.theme)
  ) {
    options.theme = props.theme
  }

  if (
    !isUndefined(props.title) &&
    !isNull(props.title) &&
    isPlainObject(props.title)
  ) {
    options.title = props.title
  }

  if (
    !isUndefined(props.tooltip) &&
    !isNull(props.tooltip) &&
    isPlainObject(props.tooltip)
  ) {
    options.tooltip = props.tooltip
  }

  if (
    !isUndefined(props.xaxis) &&
    !isNull(props.xaxis) &&
    isPlainObject(props.xaxis)
  ) {
    options.xaxis = props.xaxis
  }

  if (
    !isUndefined(props.yaxis) &&
    !isNull(props.yaxis) &&
    isPlainObject(props.yaxis)
  ) {
    options.yaxis = props.yaxis
  }

  if (
    !isUndefined(props.plotOptions) &&
    !isNull(props.plotOptions) &&
    isPlainObject(props.plotOptions)
  ) {
    options.plotOptions[options.chart.type] = props.plotOptions
  }

  console.log('chart', props, options, series)

  return (
    <ApexCharts options={options} series={series} type={options.chart.type} />
  )
}

export default Chart
