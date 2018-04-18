// Type definitions for ATV global object
// Definitions by: Tobias Lundin

//// <reference path="../../node_modules/typescript/lib/lib.d.ts" />
import {
  Function,
  Date,
  Element,
  NodeListOf,
  XMLDocument,
  XMLHttpRequest,
  Console,
  DateConstructor,
	JSON,
	ObjectConstructor
} from '../lib/lib';

interface Document {
  prototype: Document
  makeElementNamed(tagName: string): Element
  serializeToString():string
  getElementById(id:string): Element|null
}
interface Element {
  childElements: Element[]
  parent: Element
  getElementByTagName(tagName:string): Element|null
  getElementByName(tagName:string): Element|null
  getElementsByName(tagName:string): NodeListOf<Element>
  removeFromParent():void
  insertChildBefore(newChild:Element, referenceChild:Element):void
  insertChildAfter(newChild:Element, referenceChild:Element):void
}

declare function escape(arg:string):string
declare class AtvElement extends Element {}

declare namespace ATV {
  export interface Storage {
    getItem(key:string): string
    setItem(key:string, value:string): void
    removeItem(key:string): void
    clear(): void
  }
  export class ProxyDocument {
    constructor()
    onCancel(): void
    show(): void
    loadURL(url:string): void
    loadXML(xmlDoc:XMLDocument, callback?:(success:boolean)=>void): void
  }
  
  export type PlayerState = 'FastForwarding' | 'Loading' | 'Paused' | 'Playing' | 'Rewinding' | 'Stopped';
  export interface PlayerStates {
    FastForwarding: 'FastForwarding'
    Loading: 'Loading'
    Paused: 'Paused'
    Playing: 'Playing'
    Rewinding: 'Rewinding'
    Stopped: 'Stopped'
  }
  
  export type PlayerEvent = 'FFwd' | 'Pause' | 'Play' | 'Rew' | 'SkipBack' | 'SkipFwd';
  export interface PlayerEvents {
    FFwd: 'FFwd'
    Pause: 'Pause'
    Play: 'Play'
    Rew: 'Rew'
    SkipBack: 'SkipBack'
    SkipFwd: 'SkipFwd'
  }
}

export interface AtvInterface {

  // classes
  Element: AtvElement
  Document: Document

	ProxyDocument: ATV.ProxyDocument

	// Local and Session storage
	sessionStorage: ATV.Storage
  localStorage: ATV.Storage

  config: { doesJavaScriptLoadRoot: boolean }

	// Parsing XML
	parseXML: (xmlString:string) => XMLDocument

	
	onAuthenticate: (username:string, password:string, callback:Function) => void
	onLogout: () => void
	exitApp: () => void

	// Timeouts
	setInterval: (method:Function, time:number) => number
	setTimeout: (method:Function, time:number) => number
	clearInterval: (handle:number) => void
	clearTimeout: (handle:number) => void

	device: {
		displayName: string
		language: string
		preferredVideoFormat: string // HD, SD
		isInRetailDemoMode: boolean
		softwareVersion: string
	}

	// Player stuff
	player: {
		/**
		 * XML Element representing currently playing asset.
		 */
		asset: Element
		events: ATV.PlayerEvents
		states: ATV.PlayerStates
		/**
		 * Duration is a calculated value and is first made available in the onBufferSufficientToPlay callback
		 */
    currentItem: {duration:number}
    
		/**
		 * Called when the player is going to start playback, but before first media asset has been loaded.
		 */
		willStartPlaying(): void
		/**
		 * Called whenever more assets is required by the player.
		 * Callback.success expects an array of assets or null
		 */
		loadMoreAssets(callback:Function): void
		/**
		 * Called when player will stop but before asset is unloaded
		 */
		playerWillStop(elapsedTime:number): void
		/**
		 * Called when player stops playback, either by finishing or by user clicking menu
		 * Asset is unloaded at this point
		 */
		didStopPlaying(): void
		onStartBuffering(elapsedTime:number): void
		onBufferSufficientToPlay(): void
		/**
		 * Called on buffer under-run during normal speed video playback
		 */
		onStallDuringPlayback(elapsedTime:number): void
		onPlaybackError(debugMessage:string): void
		onQualityOfServiceReport(report:any): void
		/**
		 * Called when user stops, fast forwarding, rewinding or skipping in the stream
		 * Should return timeInSeconds as an adjusted time offset for player
		 */
		playerWillSeekToTime(timeInSeconds:number): number
		playerSeekToTime(timeInSeconds:number): void
		/**
		 * Called to check if user event is allowed at this point
		 * Return true for yes and false for no.
		 */
		playerShouldHandleEvent(event:ATV.PlayerEvent, elapsedTime:number): boolean
		playerStateChanged(newState:ATV.PlayerState, elapsedTime:number): void
		/**
		 * Stops video playback and displays an error dialog on screen.
		 * @param reason Will be displayed as title for error page
		 * @param message Longer description of the error
		 */
		stopWithReason(reason:string, message:string): void
		playerTimeDidChange(elapsedTime:number, playbackDate?:Date): void
		playerDateDidChange(playbackDate?:Date): void
		/**
		 * Gross time is total video length, content plus interstitials.
		 * Net time is content length only.
		 */
		convertGrossToNetTime(grossTime:number): number
		/**
		 * Gross time is total video length, content plus interstitials.
		 * Net time is content length only.
		 */
		convertNetToGrossTime(netTime:number): number
		/**
		 * Called when transport control is about to be displayed
		 * @param animationDuration Time til controls are fully visible
		 */
		onTransportControlsDisplayed(animationDuration:number): void
		/**
		 * Called when transport control is about to be hidden
		 * * @param animationDuration Time til controls are fully hidden
		 */
		onTransportControlsHidden(animationDuration:number): void
		/**
		 * Called when player selects an audio track
		 * @param audioLanguage The language identifier
		 */
		didSelectAudioTrack(audioLanguage:string): void
		/**
		 * Called once at playback startup, and anytime when the selected subtitle track changes
		 * @param trackinfo A dictionary with track language code, forced flag and non-localized name of subtitle
		 */
    didSelectSubtitleTrack(trackInfo:{ bcp47:string, forced:boolean, name:string }): void

    loadRelatedPlayback(upNextAsset:any, callback:{success: Function}): void

    currentAssetChanged(): void

    changeToAsset(playbackAsset: Element): void
	}
}

declare global {
  const atv: AtvInterface
  const document: Document
  const XMLHttpRequest: XMLHttpRequest
  const console: Console
  const Date: DateConstructor
	const JSON: JSON
	// const Object: ObjectConstructor
}

/* What it looks like for "lib.dom.d.ts" globals

interface Blob {}
interface Document {}
interface MouseEvent {}

interface Window extends EventTarget, WindowTimers, WindowSessionStorage, WindowLocalStorage, WindowConsole, GlobalEventHandlers, IDBEnvironment, WindowBase64, GlobalFetch {
  Blob: typeof Blob;
  readonly document: Document;
  event: Event | undefined;
  onclick: ((this: Window, ev: MouseEvent) => any) | null;
}
declare var Window: {
  prototype: Window;
  new(): Window;
};

declare var Blob: {
    prototype: Blob;
    new (blobParts?: any[], options?: BlobPropertyBag): Blob;
};

declare var self: Window;
declare var top: Window;
declare var window: Window;

*/
